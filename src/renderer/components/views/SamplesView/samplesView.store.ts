import { datass } from 'datass'

const $isTagCloudShown = datass.boolean(true)
const $isAddingAssetToCollection = datass.boolean(false)
const $activeAssetIndex = datass.number(-1)
const $isPlayingSound = datass.boolean(false)
const $activeTagCloudCategory = datass.string('All')
const $results = datass.array<SampleT>([])
const $activeSample = datass.object(null)

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

const parseToNumber = (value: string | number) => {
  return typeof value === 'number' ? value : parseInt(value)
}

const setMinBpm = (value: string | number) => {
  const maxBpm = $filters.state.bpmMax
  const numberValue = parseToNumber(value)
  const shouldIncreaseMaxBpm = numberValue >= maxBpm
  const bpmMax = shouldIncreaseMaxBpm ? numberValue : maxBpm
  const bpmMin = Math.max(numberValue, 0)
  $filters.set({ bpmMin, bpmMax })
}

const toggleSampleLiked = async (id: string) => {
  await window.electron.toggleAssetLiked(id)
  submitSearch()
}

const setMaxBpm = (value: string | number) => {
  const minBpm = $filters.state.bpmMin
  const numberValue = parseToNumber(value)
  const shouldReduceMinBpm = numberValue <= minBpm
  const bpmMin = shouldReduceMinBpm ? numberValue : minBpm
  const bpmMax = Math.min(numberValue, 300)
  $filters.set({ bpmMin, bpmMax })
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

  $results.set(results)
}

function toggleTagCloudVisibility() {
  $isTagCloudShown.set.toggle()
}

function clearTags() {
  $filters.set({ tags: [] })
}

const useAssetResult = (id) => {
  return $results.use((samples) => samples.find((sample) => sample._id === id))
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
  useAssetResult,
  toggleTagCloudVisibility,
  clearTags,
  toggleSampleLiked,
  setMinBpm,
  setMaxBpm,
  toggleFilterTag,
  submitSearch
}

globalThis.$samplesViewStore = $samplesViewStore
