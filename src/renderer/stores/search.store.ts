import { datass } from 'datass'
import { DESCRIPTOR_TAGS, GENRE_TAGS, INSTRUMENT_TAGS, TAGS } from '#/constants/tags'
import { ANY_KEY } from '#/constants/keys'
import { ANY_SCALE } from '#/constants/scales'
import { ANY_SAMPLE_TYPE } from '#/constants/sampleTypes'
import { INITIAL_SORT_BY_OPTION, INITIAL_SORT_ORDER_OPTION } from '#/constants/sortOptions'

const $searchValue = datass.string('')

const clearSearchValue = () => {
  $searchValue.set('')
}

const setSearchValue = (value: string) => {
  console.log({ value })
  $searchValue.set(value.trim())
}

export const $search = {
  value: $searchValue,
  clearSearchValue,
  setSearchValue
}

const $tags = datass.array<string>([])
const $key = datass.object(ANY_KEY)
const $scale = datass.object(ANY_SCALE)
const $bpmRange = datass.array([0, 240])
const $sampleType = datass.object(ANY_SAMPLE_TYPE)
const $isLikedFilterActive = datass.boolean(false)
const $tagCategoryFilter = datass.string('All')

const getTagById = (id: string) => {
  return TAGS.find((tag) => tag._id === id) as TagT
}

const setTagCategoryFilter = (value: string) => {
  $tagCategoryFilter.set(value)
}

const getCategoryFilteredTags = () => {
  if ($tagCategoryFilter.state === 'All') return TAGS
  if ($tagCategoryFilter.state === 'Genre') return GENRE_TAGS
  if ($tagCategoryFilter.state === 'Instrument') return INSTRUMENT_TAGS
  if ($tagCategoryFilter.state === 'Descriptor') return DESCRIPTOR_TAGS
}

const useCategoryFilteredTags = () => {
  $tagCategoryFilter.use()
  return getCategoryFilteredTags()
}

const useActiveTags = () => {
  const activeTagIds = $tags.use()
  const activeTags = TAGS.filter((tag) => activeTagIds.includes(tag._id))
  return activeTags as TagT[]
}

const useInactiveTagCloudTags = () => {
  $tags.use()
  const categoryTags = useCategoryFilteredTags()
  const withoutActiveTags = categoryTags?.filter((tag) => !checkIsTagActive(tag._id)) as TagT[]
  return withoutActiveTags
}

const removeTag = (id: string) => {
  const newTags = $tags.state.filter((tagId) => tagId !== id)
  $tags.set(newTags)
}

const addTag = (id: string) => {
  $tags.set.append(id)
}

const checkIsTagActive = (id: string) => {
  return $tags.state.includes(id)
}

const toggleTag = (id: string) => {
  const isTagActive = checkIsTagActive(id)
  if (isTagActive) removeTag(id)
  if (!isTagActive) addTag(id)
}

const getNonActiveTags = (tags: TagT[]) => {
  return tags.filter((tag) => {
    return !checkIsTagActive(tag._id)
  })
}

const useNonActiveTags = (tags: TagT[]) => {
  $tags.use()
  return getNonActiveTags(tags)
}

const setKey = (key: any) => {
  $key.set(key)
}

const setScale = (scale: any) => {
  $scale.set(scale)
}

const setSampleType = (value: any) => {
  $sampleType.set(value)
}

const parseToNumber = (value: string | number) => {
  return typeof value === 'number' ? value : parseInt(value)
}

const setMinBpm = (value: string | number) => {
  const maxBpm = $bpmRange.state[1]
  const numberValue = parseToNumber(value)
  const shouldIncreaseMaxBpm = numberValue >= maxBpm
  const newMaxBpm = shouldIncreaseMaxBpm ? numberValue : maxBpm
  const correctedValue = Math.max(numberValue, 0)
  $bpmRange.set([correctedValue, newMaxBpm])
}

const setMaxBpm = (value: string | number) => {
  const minBpm = $bpmRange.state[0]
  const numberValue = parseToNumber(value)
  const shouldReduceMinBpm = numberValue <= minBpm
  const newMinBpm = shouldReduceMinBpm ? numberValue : minBpm
  const correctedValue = Math.min(numberValue, 300)
  $bpmRange.set([newMinBpm, correctedValue])
}

const setBpmRange = (min: number, max: number) => {
  $bpmRange.set([min, max])
}

export const $filters = {
  tags: $tags,
  bpmRange: $bpmRange,
  key: $key,
  scale: $scale,
  isLikedFilterActive: $isLikedFilterActive,
  sampleType: $sampleType,
  tagCategoryFilter: $tagCategoryFilter,
  useTagCloudTags: useInactiveTagCloudTags,
  useActiveTags,
  getCategoryFilteredTags,
  setTagCategoryFilter,
  setSampleType,
  setMinBpm,
  setMaxBpm,
  setBpmRange,
  setKey,
  setScale,
  toggleTag,
  addTag,
  removeTag,
  getNonActiveTags,
  useNonActiveTags
}

const $sortBy = datass.object(INITIAL_SORT_BY_OPTION)
const $sortOrder = datass.object(INITIAL_SORT_ORDER_OPTION)

const setSortByOption = (value: any) => {
  $sortBy.set(value)
}

const setSortOrderOption = (value: any) => {
  $sortOrder.set(value)
}

export const $sort = {
  by: $sortBy,
  order: $sortOrder,
  setSortByOption,
  setSortOrderOption
}
