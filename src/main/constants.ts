// Name of the configuration file
export const CONFIG_FILENAME = 'sanatyStore.json'
import { TAGS } from '#/constants'

// Default configuration structure
export const DEFAULT_CONFIG = {
  folders: [],
  assets: [],
  collections: [],
  tags: TAGS,
  settings: {}
}

export const EMPTY_SAMPLE_QUERY = {
  text: '',
  isLiked: false,
  tags: [],
  collectionId: '',
  bpmRange: [0, 300],
  durationRange: [0, 600],
  key: '',
  scale: '',
  sampleType: '',
  sortBy: 'name',
  sortOrder: 'ascending'
} as AssetSearchQueryT
