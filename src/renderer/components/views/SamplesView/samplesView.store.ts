import { INITIAL_ITEMS_PER_PAGE_OPTION, ITEMS_PER_PAGE_OPTIONS_MAP } from '#/constants/sortOptions'
import { parseToNumber } from '#/modules/number'
import { datass } from 'datass'

const $isTagCloudShown = datass.boolean(true)
const $isAddingAssetToCollection = datass.boolean(false)
const $activeAssetIndex = datass.number(-1)
const $isPlayingSound = datass.boolean(false)
const $activeTagCloudCategory = datass.string('All')
const $results = datass.array<SampleT>([])
const $activeSample = datass.object(null)
const $currentPageResults = datass.array<SampleT>([])

const $filters = datass.object({
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

function toggleFilterTag(id: string) {
  const tags = new Set($filters.state.tags)
  const isActive = tags.has(id)
  if (isActive) tags.delete(id)
  if (!isActive) tags.add(id)
  const newTags = Array.from(tags)
  $filters.set({ tags: newTags })
}

const toggleSampleLiked = async (id: string) => {
  await window.electron.toggleAssetLiked(id)
  submitSearch()
}

const setMinBpm = (value: string | number) => {
  const maxBpm = $filters.state.bpmMax
  const numberValue = parseToNumber(value)
  const shouldIncreaseMaxBpm = numberValue >= maxBpm
  const bpmMax = shouldIncreaseMaxBpm ? numberValue : maxBpm
  const bpmMin = Math.max(numberValue, 0)
  $filters.set({ bpmMin, bpmMax })
}

const setMaxBpm = (value: string | number) => {
  const minBpm = $filters.state.bpmMin
  const numberValue = parseToNumber(value)
  const shouldReduceMinBpm = numberValue <= minBpm
  const bpmMin = shouldReduceMinBpm ? numberValue : minBpm
  const bpmMax = Math.min(numberValue, 300)
  $filters.set({ bpmMin, bpmMax })
}

const setMinDuration = (value: string | number) => {
  const maxDuration = $filters.state.durationMax
  const numberValue = parseToNumber(value)
  const shouldIncreaseMaxDuration = numberValue >= maxDuration
  const durationMax = shouldIncreaseMaxDuration ? numberValue : maxDuration
  const durationMin = Math.max(numberValue, 0)
  $filters.set({ durationMin, durationMax })
}

const setMaxDuration = (value: string | number) => {
  const minDuration = $filters.state.durationMin
  const numberValue = parseToNumber(value)
  const shouldReduceMinDuration = numberValue <= minDuration
  const durationMin = shouldReduceMinDuration ? numberValue : minDuration
  const durationMax = Math.min(numberValue, 300)
  $filters.set({ durationMin, durationMax })
}

async function submitSearch() {
  const filters = $filters.state

  const results = await window.electron.searchSamples({
    searchValue: filters.searchValue,
    key: filters.key,
    scale: filters.scale,
    sampleType: filters.sampleType,
    isLiked: filters.isLiked,
    bpmMin: filters.bpmMin,
    bpmMax: filters.bpmMax,
    durationMin: filters.durationMin,
    durationMax: filters.durationMax,
    sortOrder: filters.sortOrder,
    sortBy: filters.sortBy,
    tags: filters.tags,
    collectionId: filters.collectionId,
    folderId: filters.folderId
  })

  updateResults(results)
  updatePagination()
}

function toggleTagCloudVisibility() {
  $isTagCloudShown.set.toggle()
}

function clearTags() {
  $filters.set({ tags: [] })
}

const useAssetResult = (id) => {
  return $results.use((samples) => samples.find((sample) => (sample._id || sample.id) === id))
}

const useIsSampleActive = (id) => {
  const activeSample = $activeSample.use()
  return activeSample ? (activeSample._id || activeSample.id) === id : false
}

export const $samplesViewStore = {
  filters: $filters,
  results: $results,
  activeSample: $activeSample,
  activeTagCloudCategory: $activeTagCloudCategory,
  isTagCloudShown: $isTagCloudShown,
  isAddingAssetToCollection: $isAddingAssetToCollection,
  activeAssetIndex: $activeAssetIndex,
  isPlayingSound: $isPlayingSound,
  currentPageResults: $currentPageResults,
  useAssetResult,
  useIsSampleActive,
  toggleTagCloudVisibility,
  clearTags,
  toggleSampleLiked,
  setMinBpm,
  setMaxBpm,
  setMinDuration,
  setMaxDuration,
  toggleFilterTag,
  submitSearch
}

const $totalPages = datass.number(1)
const $currentPage = datass.number(1)
const $itemsPerPage = datass.number(10)
const $itemsPerPageOption = datass.object(INITIAL_ITEMS_PER_PAGE_OPTION)

const clamp = (val, min, max) => Math.min(Math.max(val, min), max)

function updateCurrentPageResults() {
  const startIndex = ($currentPage.state - 1) * $itemsPerPage.state
  const endIndex = startIndex + $itemsPerPage.state
  const newPageResults = $results.state.slice(startIndex, endIndex) || []
  $currentPageResults.set(newPageResults)
}

function updateResults(results) {
  $results.set(results)
  updateCurrentPageResults()
}

const goToPage = (pageNumber: number) => {
  const totalPages = $totalPages.state
  const value = clamp(pageNumber, 1, totalPages)
  $currentPage.set(value)
  updateCurrentPageResults()
}

const goToNextPage = () => {
  const currentPage = $currentPage.state
  goToPage(currentPage + 1)
}

const goToPreviousPage = () => {
  const currentPage = $currentPage.state
  goToPage(currentPage - 1)
}

const updatePagination = () => {
  const resultCount = $results.state.length
  const totalPages = Math.max(1, Math.ceil(resultCount / $itemsPerPage.state))
  const currentPage = clamp($currentPage.state, 1, totalPages)
  $totalPages.set(totalPages)
  $currentPage.set(currentPage)
  updateCurrentPageResults()
}

const setItemsPerPage = (itemsPerPage: string) => {
  const numberValue = parseToNumber(itemsPerPage)
  const totalResults = $results.state.length
  const totalPages = Math.ceil(totalResults / numberValue)
  const activeSampleIndex = $activeAssetIndex.state // index of active sample
  const currentPageBase = Math.floor(activeSampleIndex / numberValue) + 1
  const currentPage = clamp(currentPageBase, 1, totalPages)
  $totalPages.set(totalPages)
  $currentPage.set(currentPage)
  $itemsPerPage.set(numberValue)
  updateCurrentPageResults()
}

const goToFirstPage = () => goToPage(1)
const goToLastPage = () => goToPage($totalPages.state)

export const $pagination = {
  totalPages: $totalPages,
  currentPage: $currentPage,
  itemsPerPage: $itemsPerPage,
  itemsPerPageOption: $itemsPerPageOption,
  goToPreviousPage,
  goToNextPage,
  goToPage,
  goToFirstPage,
  goToLastPage,
  updatePagination,
  setItemsPerPage
}

globalThis.$samplesViewStore = $samplesViewStore
globalThis.$pagination = $pagination
