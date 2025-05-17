import React from 'react'
import { datass } from 'datass'
import { _number, toNumber } from '#/modules/number'
import { $playback } from './playback.store'

class SearchStore {
  filters = datass.object({
    searchValue: '',
    tonic: 'Any Tonic',
    scale: 'Any Scale',
    sampleType: 'Any Type',
    tags: [],
    isLiked: false,
    bpmMin: 50,
    bpmMax: 300,
    durationMin: 0,
    durationMax: 600,
    sortBy: 'Date Added',
    sortOrder: 'Descending',
    collectionId: '',
    folderId: ''
  })

  results = datass.object({
    currentPage: [],
    all: []
  })

  pagination = datass.object({
    itemsPerPage: 20,
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
  useIsLikedFilterActive = () => this.useFilterValue('isLiked')

  usePageResults = () => this.useResultsValue('currentPage')
  useAllResults = () => this.useResultsValue('all')

  usePaginationCurrentPage = () => this.usePaginationValue('currentPage')
  usePaginationTotalPages = () => this.usePaginationValue('totalPages')
  usePaginationItemsPerPage = () => this.usePaginationValue('itemsPerPage')

  getCorrectedFilters = () => {
    const filters = { ...this.filters.state }
    if (filters.sortBy === 'Date Added') filters.sortBy = 'dateAdded'
    if (filters.sortBy === 'Duration') filters.sortBy = 'duration'
    if (filters.sortBy === 'Name') filters.sortBy = 'name'
    filters.sortOrder = filters.sortOrder.toLowerCase()
    return filters
  }

  searchSamples = async () => {
    const filters = this.getCorrectedFilters()
    const results = await window.electron.searchSamples(filters)
    $playback.clearActiveSample()
    this.results.set({ all: results })
    this.update()
  }

  softSearchSamples = async () => {
    const filters = this.filters.state
    const results = await window.electron.searchSamples(filters)
    this.results.set({ all: results })
    this.update()
  }

  resetSearch = () => {
    this.filters.set.reset()
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
    const numberValue = toNumber(value)
    const shouldIncreaseMaxBpm = numberValue >= maxBpm
    const bpmMax = shouldIncreaseMaxBpm ? numberValue : maxBpm
    const bpmMin = Math.max(numberValue, 0)
    this.filters.set({ bpmMin, bpmMax })
  }

  setMaxBpm = (value) => {
    const minBpm = this.filters.state.bpmMin
    const numberValue = toNumber(value)
    const shouldReduceMinBpm = numberValue <= minBpm
    const bpmMin = shouldReduceMinBpm ? numberValue : minBpm
    const bpmMax = Math.min(numberValue, 300)
    this.filters.set({ bpmMin, bpmMax })
  }

  setMinDuration = (value) => {
    const maxDuration = this.filters.state.durationMax
    const numberValue = toNumber(value)
    const shouldIncreaseMaxDuration = numberValue >= maxDuration
    const durationMax = shouldIncreaseMaxDuration ? numberValue : maxDuration
    const durationMin = Math.max(numberValue, 0)
    this.filters.set({ durationMin, durationMax })
  }

  setMaxDuration = (value) => {
    const minDuration = this.filters.state.durationMin
    const numberValue = toNumber(value)
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
    const itemsPerPage = toNumber(newItemsPerPage)
    const totalResults = this.results.state.all.length
    const totalPages = Math.ceil(totalResults / itemsPerPage)
    const activeSampleIndex = $playback.activeAssetIndex.state
    const currentPageBase = Math.floor(activeSampleIndex / itemsPerPage) + 1
    const currentPage = _number(currentPageBase).clamp(1, totalPages)
    this.pagination.set({ totalPages, currentPage, itemsPerPage })
    this.update()
  }

  useSampleById = (id) => {
    const [sample, setSample] = React.useState({})

    React.useEffect(() => {
      if (!id) return

      window.electron.getSampleById(id).then((data) => {
        setSample(data || {})
      })
    }, [id])

    return sample as SampleT
  }

  useSampleResult = (id) => {
    return this.results.use((state) => state.all.find((sample) => sample.id === id))
  }

  useIsSampleActive = (id) => {
    const activeSampleId = $playback.activeSampleId.use()
    return activeSampleId === id
  }

  setSortBy = (value) => {
    this.filters.set({ sortBy: value })
    this.searchSamples()
  }

  setSortOrder = (value) => {
    this.filters.set({ sortOrder: value })
    this.searchSamples()
  }
}

export const $search = new SearchStore()
globalThis.search = $search
