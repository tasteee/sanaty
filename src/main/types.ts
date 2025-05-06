export type FolderT = {
  id: string
  path: string
  name: string
  createdDate: number
  updatedDate: number
}

export type TagT = {
  id: string
  label: string
  category: string
  createdDate: number
  updatedDate: number
}

export type BaseAssetT = {
  id: string
  folderId: string
  name: string
  filePath: string
  fileSize: number
  isLiked: boolean
  tagIds: string[]
  createdDate: number
  updatedDate: number
  dateAdded: number
  dateModified: number
}

export type SampleAssetT = BaseAssetT & {
  fileType: string
  extension: string
  duration: number
  bpm: number
  key: string
  scale: string
  sampleType: 'loop' | 'oneShot'
}

export type CollectionT = {
  id: string
  name: string
  assetIds: string[]
  createdDate: number
  updatedDate: number
}

export type AssetSearchQueryT = {
  text?: string
  tagIds?: string[]
  collectionId?: string
  isLiked?: boolean

  // searchValue: string
  key: string
  scale: string
  bpmRange: [number, number]
  lengthRange: [number, number]
  sampleType: string
}
