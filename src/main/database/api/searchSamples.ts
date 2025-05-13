import { $likes, $samples } from '../setup'

type SampleSearchQueryT = {
  key: string
  scale: string
  sampleType: string
  isLiked: boolean
  bpmMin: number
  bpmMax: number
  durationMin: number
  durationMax: number
  searchValue: string
  sortOrder: string
  sortBy: string
  tags: string[]
}

const DEFAULT_QUERY_OPTIONS = {
  tonic: 'any',
  scale: 'any',
  sampleType: 'any',
  isLiked: false,
  bpmMin: 0,
  bpmMax: 0,
  durationMin: 0,
  durationMax: 0,
  searchValue: '',
  sortOrder: 'ascending',
  sortBy: 'name',
  tags: [],
  collectionId: '',
  folderId: ''
}

export async function searchSamples(searchFilters: Partial<SampleSearchQueryT>) {
  const filters = { ...DEFAULT_QUERY_OPTIONS, ...searchFilters }
  const queryOptions = {} as any

  if (filters.collectionId) queryOptions.collectionId = filters.collectionId
  if (filters.folderId) queryOptions.folderId = filters.folderId
  if (filters.tonic !== 'any') queryOptions.tonic = filters.tonic
  if (filters.scale !== 'any') queryOptions.scale = filters.scale
  if (filters.sampleType !== 'any') queryOptions.sampleType = filters.sampleType

  if (filters.bpmMin && filters.bpmMax) {
    const range = [filters.bpmMin, filters.bpmMax]
    queryOptions.bpm$ = { $isBetween: range }
  }

  if (filters.durationMin && filters.durationMax) {
    const range = [filters.durationMin, filters.durationMax]
    queryOptions.duration$ = { $isBetween: range }
  }

  if (filters.searchValue) queryOptions.name$ = { $contains: filters.searchValue }

  if (filters.isLiked) {
    const likedIds = $likes.query().map((like) => like.id)
    queryOptions.id$ = { $isIn: likedIds }
  }

  if (filters.tags && filters.tags.length > 0) {
    queryOptions.tags$ = { $contains: filters.tags }
  }

  const results = $samples.query(queryOptions)

  // Apply sorting
  const sortedResults = applySorting(results, filters.sortBy, filters.sortOrder)
  return sortedResults
}

// Helper function to apply sorting
function applySorting(results: any[], sortBy: string, sortOrder: string) {
  return [...results].sort((a, b) => {
    const valueA = a[sortBy]
    const valueB = b[sortBy]

    // Handle null/undefined values
    if (valueA === undefined || valueA === null) return sortOrder === 'ascending' ? -1 : 1
    if (valueB === undefined || valueB === null) return sortOrder === 'ascending' ? 1 : -1

    // Compare based on type
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortOrder === 'ascending' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
    } else {
      // For numbers and other comparable types
      if (sortOrder === 'ascending') {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0
      } else {
        return valueB < valueA ? -1 : valueB > valueA ? 1 : 0
      }
    }
  })
}
