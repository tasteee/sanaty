import { JSONFilePreset } from 'lowdb/node'
import { listerine } from 'listerine'

type LoadStoreOptionsT<KeyT extends string> = {
  key: KeyT
  filePath: string
  defaultData: any[]
}

export async function loadStore<KeyT extends string, DataT>(options: LoadStoreOptionsT<KeyT>) {
  type StoreDataT = Record<KeyT, DataT[]>
  const defaultData = { [options.key]: options.defaultData } as StoreDataT
  const store = await JSONFilePreset<StoreDataT>(options.filePath, defaultData)

  function getAll() {
    return store.data[options.key]
  }

  function getById(id) {
    const allItems = getAll()
    return listerine(allItems).query({ id })
  }

  function getByIds(ids: string[]) {
    const allItems = getAll()
    return listerine(allItems).query({ id$: { $isIn: ids } })
  }

  function add(...items: DataT[]) {
    store.update((data) => {
      data[options.key].push(...items)
    })
  }

  function update(newData: DataT[]) {
    store.data = { [options.key]: newData } as StoreDataT
  }

  function updateById(id, updates) {
    store.update((data) => {
      data[options.key] = data[options.key].map((item) => {
        if (item.id !== id) return item
        return { ...item, ...updates }
      })
    })
  }

  function modify(updater) {
    store.update((data) => {
      data[options.key] = data[options.key].map((item) => {
        return updater(item)
      })
    })
  }

  function removeById(id) {
    store.update((data) => {
      data[options.key] = data[options.key].filter((item) => {
        return item.id !== id
      })
    })
  }

  function removeByIds(ids: string[]) {
    store.update((data) => {
      data[options.key] = data[options.key].filter((item: DataT) => {
        return !ids.includes(item.id)
      })
    })
  }

  function query(filters) {
    const data = getAll()
    return listerine(data).query(filters)
  }

  return {
    getById,
    getByIds,
    add,
    removeById,
    removeByIds,
    query,
    updateById,
    update,
    modify
  }
}
