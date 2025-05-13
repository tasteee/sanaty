import fs from 'fs'
import { listerine } from 'listerine'
import debounce from 'just-debounce'
import { getTimestamp } from './helpers'
import { of } from 'await-of'

// Type definitions
type StoreOptions<DataT> = {
  name: string
  filePath: string
  defaultData: DataT[]
}

type Store<DataT> = {
  update: any
  get state(): DataT[]
  set state(newState: DataT[])
  query: QueryFunction<DataT>
  queryUpdate: QueryUpdateFunction<DataT>
  queryRemove: QueryRemoveFunction
  queryById: QueryByIdFunctionT<DataT>
  queryByIds: QueryByIdsFunctionT<DataT>
  immediatePersist: () => Promise<void>
}

type QueryFunction<DataT> = {
  (): DataT[]
  (id: string): DataT | undefined
  (ids: string[]): DataT[]
  (queryOptions: any): DataT[]
}

type QueryByIdFunctionT<DataT> = (id: string) => DataT
type QueryByIdsFunctionT<DataT> = (ids: string[]) => DataT[]

type QueryUpdateFunction<DataT> = {
  (id: string, updater: (item: DataT) => void): { result: DataT | undefined; state: DataT[] }
  (ids: string[], updater: (item: DataT, state: DataT[]) => void): { results: DataT[]; state: DataT[] }
  (queryOptions: any, updater: (item: DataT, state: DataT[]) => void): { results: DataT[]; state: DataT[] }
}

type QueryRemoveFunction = {
  (id: string): number
  (ids: string[]): number
  (queryOptions: any): any[]
}

// Store all references in memory
const storeReferences: Record<string, any[]> = {}

function loadFileJSON<DataT>(options: StoreOptions<DataT>): DataT[] {
  console.log('loading json file ', options.filePath)
  const doesFileExist = fs.existsSync(options.filePath)
  const stringDefaultData = JSON.stringify(options.defaultData)
  if (!doesFileExist) fs.writeFileSync(options.filePath, stringDefaultData, 'utf8')
  const contents = fs.readFileSync(options.filePath, 'utf8')
  return JSON.parse(contents)
}

/**
 * Create a debounced function that executes after specified delay
 */
const debouncer = <DataT extends (...args: any[]) => any>(targetFunction: DataT) => {
  return debounce(targetFunction, 500)
}

/**
 * Handle process exit to ensure data is persisted
 */
function applyExitHandler<DataT>(options: StoreOptions<DataT>, persist: () => Promise<void>): void {
  process.on('SIGINT', () => {
    persist().then(() => process.exit(0))
  })

  process.on('exit', () => {
    try {
      const currentData = storeReferences[options.name]
      fs.writeFileSync(options.filePath, JSON.stringify(currentData), 'utf8')
      console.log(`[ ${getTimestamp()} ] persisted json store ${options.name} on exit`)
    } catch (error) {
      console.error(`Error persisting store ${options.name} on exit:`, error)
    }
  })
}

/**
 * Create a JSON store with persistence and query capabilities
 */
export function loadStore<DataT extends { id: string }>(options: StoreOptions<DataT>): Store<DataT> {
  // Load initial data
  storeReferences[options.name] = loadFileJSON<DataT>(options)

  function update(newState: DataT[]) {
    console.log('updating ', options.name, newState)
    storeReferences[options.name] = newState
    persist()
  }

  // Create the base store with state getter/setter
  const baseStore = {
    get state(): DataT[] {
      return storeReferences[options.name]
    },

    set state(newState: DataT[]) {
      console.log('setting ', options.name, newState)
      storeReferences[options.name] = newState
      persist()
    },

    update
  }

  /**
   * Immediately persist data to file
   */
  async function immediatePersist(): Promise<void> {
    console.log('persisting ', options.name)

    try {
      const currentData = storeReferences[options.name]
      const stringData = JSON.stringify(currentData)
      await fs.promises.writeFile(options.filePath, stringData)
      const timeStamp = getTimestamp()
      console.log(`[ ${timeStamp} ] persisted json store ${options.name} to ${options.filePath}`)
    } catch (error) {
      console.error(`Error persisting ${options.name} to ${options.filePath}:`, error)
    }
  }

  // Create debounced persist function
  const persist = debouncer(immediatePersist)

  // Apply exit handler
  applyExitHandler(options, immediatePersist)

  /**
   * Query store data by id, array of ids, or query options
   */
  function query(arg?: string | string[] | any): DataT | DataT[] {
    const currentData = baseStore.state
    if (!arg) return currentData

    if (typeof arg === 'string') {
      const id = arg
      const results = listerine(currentData).query({ id })
      return results[0]
    }

    if (Array.isArray(arg)) {
      const ids = arg
      return listerine(currentData).query({ id$: { $isOneOf: ids } })
    }

    const queryOptions = arg
    const results = listerine(currentData).query(queryOptions)
    return results || []
  }

  function queryById(id: string): DataT {
    const results = listerine(baseStore.state).query({ id })
    return results[0]
  }

  function queryByIds(ids: string[]): DataT[] {
    const results = listerine(baseStore.state).query({ id$: { $isOneOf: ids } })
    return results
  }

  /**
   * Query and update store data
   */
  function queryUpdate(
    arg: string | string[] | any,
    updater: (item: DataT, state?: DataT[]) => void
  ): { result?: DataT; results?: DataT[]; state: DataT[] } {
    if (typeof arg === 'string') {
      const result = query(arg) as DataT | undefined
      if (result) {
        updater(result)
        baseStore.update([...baseStore.state])
      }
      return { result, state: baseStore.state }
    }

    if (Array.isArray(arg)) {
      const ids = arg
      const results = query(ids) as DataT[]
      results.forEach((result) => updater(result, baseStore.state))
      baseStore.update([...baseStore.state])

      return { results, state: baseStore.state }
    }

    const queryOptions = arg
    const results = listerine(baseStore.state).query(queryOptions)
    results.forEach((result) => updater(result, baseStore.state))
    baseStore.update([...baseStore.state])

    return { results, state: baseStore.state }
  }

  /**
   * Remove items from store based on query
   */
  function queryRemove(arg: string | string[] | any): number | any[] {
    const currentData = baseStore.state

    if (typeof arg === 'string') {
      const id = arg
      const currentCount = currentData.length
      const filteredResults = listerine(currentData).query({ id$: { $isNot: id } })
      baseStore.update(filteredResults)

      return currentCount - filteredResults.length
    }

    if (Array.isArray(arg)) {
      const ids = arg
      const currentCount = currentData.length
      const filteredResults = listerine(currentData).query({ id$: { $isNotOneOf: ids } })
      baseStore.update(filteredResults)
      return currentCount - filteredResults.length
    }

    const queryOptions = arg
    return listerine(currentData).query(queryOptions)
  }

  // Attach methods to the store
  const store: Store<DataT> = {
    ...baseStore,
    set state(newState: any) {
      console.log('setting ', options.name, newState)
      storeReferences[options.name] = newState
      persist()
    },

    get state() {
      return storeReferences[options.name]
    },

    update: update as any,
    query: query as QueryFunction<DataT>,
    queryUpdate: queryUpdate as QueryUpdateFunction<DataT>,
    queryRemove: queryRemove as QueryRemoveFunction,
    queryByIds: queryByIds as QueryByIdsFunctionT<DataT>,
    queryById: queryById as QueryByIdFunctionT<DataT>,
    immediatePersist
  }

  return store
}
