// #/database/api.ts
import { too } from '#/modules/too'
import store from 'store'
import pocket from './pocket'

const folders = pocket.collection('folders')
const samples = pocket.collection('samples')
const collections = pocket.collection('collections')

type SearchSampleOptionsT = {
  searchValue?: string
  folderId?: string
  isLiked?: boolean
  collectionId?: string
  sampleTypes?: string[]
  bpmRange?: [number, number]
  durationRange?: [number, number]
  sortBy?: string // name, dateAdded, duration,
  sortOrder?: 'ascending' | 'descending'
  limit?: number
  offset?: number
}

const DEFAULT_SEARCH_OPTIONS = {
  searchValue: '',
  folderId: '',
  isLiked: false,
  collectionId: '',
  sampleType: '',
  sortBy: 'dateAdded', // name, dateAdded, duration,
  sortOrder: 'ascending',
  limit: 1000,
  offset: 0
}

async function searchSamples(searchOptions: SearchSampleOptionsT) {
  const options = { ...DEFAULT_SEARCH_OPTIONS, ...searchOptions }
  const searchValue = options.searchValue.trim()
  const filterParts: string[] = []
  console.log('searchSamples ', options)

  if (searchValue !== '') filterParts.push(`(name ~ '${searchValue}')`)
  if (options.folderId) filterParts.push(`folder = '${options.folderId}'`)
  if (options.collectionId) filterParts.push(`collections ?= '${options.collectionId}'`)
  if (options.sampleType) filterParts.push(`kind = '${options.sampleType}'`)

  if (options.bpmRange) filterParts.push(`(bpm >= ${options.bpmRange[0]} && bpm <= ${options.bpmRange[1]})`)
  if (options.durationRange) filterParts.push(`(duration >= ${options.durationRange[0]} && duration <= ${options.durationRange[1]})`)

  const filterString = filterParts.length > 0 ? filterParts.join(' && ') : ''
  const sortPrefix = options.sortOrder === 'descending' ? '-' : ''
  const sortString = `${sortPrefix}${options.sortBy}`
  const page = Math.floor(options.offset / (options.limit || 30)) + 1
  const perPage = options.limit || 500

  // Build query options
  const queryOptions: any = {
    sort: sortString,
    page: page,
    perPage: perPage
  }

  if (filterString) {
    queryOptions.filter = filterString
  }

  // Execute the query
  return too('Search Samples', samples.getList(page, perPage, queryOptions))
}

export { searchSamples }
