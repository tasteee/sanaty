import { datass } from 'datass'
import { _number, parseToNumber } from '#/modules/number'
import { $ui } from './ui.store'
import { makeGlobal } from '#/modules/_global'

class SearchStore {
  filters = datass.object({
    searchValue: '',
    key: 'any',
    scale: 'any',
    sampleType: 'any',
    tags: [],
    isLiked: false,
    bpmMin: 0,
    bpmMax: 300,
    durationMin: 0,
    durationMax: 600,
    sortBy: 'name',
    sortOrder: 'descinding',
    collectionId: '',
    folderId: ''
  })

  results = datass.object({
    currentPage: [],
    all: []
  })

  pagination = datass.object({
    itemsPerPage: 10,
    totalPages: 1,
    currentPage: 1
  })

  useResultCount = () => this.results.use((state) => state.all.length)
  useFilterValue = (key) => this.filters.use((state) => state[key])
  useResultsValue = (key) => this.results.use((state) => state[key])
  usePaginationValue = (key) => this.pagination.use((state) => state[key])

  useCollectionIdFilter = () => this.useFilterValue('collectionId')
  useFolderIdFilter = () => this.useFilterValue('folderId')
  useSortByFilter = () => this.useFilterValue('sortBy')
  useSortOrderFilter = () => this.useFilterValue('sortOrder')
  useFilterTags = () => this.useFilterValue('tags')

  usePageResults = () => this.useResultsValue('currentPage')
  useAllResults = () => this.useResultsValue('all')

  usePaginationCurrentPage = () => this.usePaginationValue('currentPage')
  usePaginationTotalPages = () => this.usePaginationValue('totalPages')
  usePaginationItemsPerPage = () => this.usePaginationValue('itemsPerPage')

  searchSamples = async () => {
    console.log('searching samples', this.filters.state)
    const filters = this.filters.state
    const results = await window.electron.searchSamples(filters)
    this.results.set({ all: results })
    console.log('search results', results)
    this.update()
  }

  reset = () => {
    this.filters.set.reset()
    this.results.set.reset()
    this.pagination.set.reset()
  }

  update = () => {
    const currentResults = this.results.state
    const pagination = this.pagination.state
    const resultCount = currentResults.all.length
    const totalPages = Math.max(1, Math.ceil(resultCount / pagination.itemsPerPage))
    const currentPage = _number(pagination.currentPage).clamp(1, totalPages)
    this.pagination.set({ totalPages, currentPage })
    const startIndex = (currentPage - 1) * pagination.itemsPerPage
    const endIndex = startIndex + pagination.itemsPerPage
    const newPageResults = currentResults.all.slice(startIndex, endIndex) || []
    this.results.set({ currentPage: newPageResults })
  }

  toggleTag = (id) => {
    const tags = new Set(this.filters.state.tags)
    const isActive = tags.has(id)
    if (isActive) tags.delete(id)
    if (!isActive) tags.add(id)
    const newTags = Array.from(tags)
    this.filters.set({ tags: newTags })
  }

  clearTags = () => {
    this.filters.set({ tags: [] })
  }

  setMinBpm = (value) => {
    const maxBpm = this.filters.state.bpmMax
    const numberValue = parseToNumber(value)
    const shouldIncreaseMaxBpm = numberValue >= maxBpm
    const bpmMax = shouldIncreaseMaxBpm ? numberValue : maxBpm
    const bpmMin = Math.max(numberValue, 0)
    this.filters.set({ bpmMin, bpmMax })
  }

  setMaxBpm = (value) => {
    const minBpm = this.filters.state.bpmMin
    const numberValue = parseToNumber(value)
    const shouldReduceMinBpm = numberValue <= minBpm
    const bpmMin = shouldReduceMinBpm ? numberValue : minBpm
    const bpmMax = Math.min(numberValue, 300)
    this.filters.set({ bpmMin, bpmMax })
  }

  setMinDuration = (value) => {
    const maxDuration = this.filters.state.durationMax
    const numberValue = parseToNumber(value)
    const shouldIncreaseMaxDuration = numberValue >= maxDuration
    const durationMax = shouldIncreaseMaxDuration ? numberValue : maxDuration
    const durationMin = Math.max(numberValue, 0)
    this.filters.set({ durationMin, durationMax })
  }

  setMaxDuration = (value) => {
    const minDuration = this.filters.state.durationMin
    const numberValue = parseToNumber(value)
    const shouldReduceMinDuration = numberValue <= minDuration
    const durationMin = shouldReduceMinDuration ? numberValue : minDuration
    const durationMax = Math.min(numberValue, 600) // Changed to 600 to match initial state
    this.filters.set({ durationMin, durationMax })
  }

  goToPage = (pageNumber) => {
    const totalPages = this.pagination.state.totalPages
    const value = _number(pageNumber).clamp(1, totalPages)
    this.pagination.set({ currentPage: value })
    this.update()
  }

  goToNextPage = () => {
    const currentPage = this.pagination.state.currentPage
    this.goToPage(currentPage + 1)
  }

  goToPreviousPage = () => {
    const currentPage = this.pagination.state.currentPage
    this.goToPage(currentPage - 1)
  }

  goToFirstPage = () => {
    this.goToPage(1)
  }

  goToLastPage = () => {
    this.goToPage(this.pagination.state.totalPages)
  }

  setItemsPerPage = (newItemsPerPage) => {
    const itemsPerPage = parseToNumber(newItemsPerPage)
    const totalResults = this.results.state.all.length
    const totalPages = Math.ceil(totalResults / itemsPerPage)
    const activeSampleIndex = $ui.activeAssetIndex.state
    const currentPageBase = Math.floor(activeSampleIndex / itemsPerPage) + 1
    const currentPage = _number(currentPageBase).clamp(1, totalPages)
    this.pagination.set({ totalPages, currentPage, itemsPerPage })
    this.update()
  }

  useSampleResult = (id) => {
    return this.results.use((state) => state.all.find((sample) => (sample._id || sample.id) === id))
  }

  useIsSampleActive = (id) => {
    const activeSampleId = $ui.activeSampleId.use()
    return activeSampleId === id
  }

  setSortBy = (value) => {
    this.filters.set({ sortBy: value })
  }

  setSortOrder = (value) => {
    this.filters.set({ sortOrder: value })
  }
}

export const $search = new SearchStore()
makeGlobal('search', $search)
