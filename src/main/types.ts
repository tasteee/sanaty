export type FolderT = {
  id: string
  path: string
  name: string
  createdDate: number
}

export type TagT = {
  id: string
  label: string
  category: string
  createdDate: number
}

export type SampleT = {
  id: string
  name: string // 'foo_bar'
  fileName: string // 'foo.bar.wav'
  path: string // 'file://C://a/b/c/foo.bar.wav'
  size: number // bytes
  isLiked: boolean
  isDisliked: boolean
  tags: string[]
  folderId: string
  extension: string // 'wav', 'mp3', etc
  duration: number // seconds
  bpm: number
  key: string
  scale: string
  kind: 'loop' | 'oneShot'
  createdDate: number
}

export type CollectionT = {
  id: string
  name: string
  description: string
  sampleIds: string[]
  artworkPath: string
  createdDate: number
}

export type AssetSearchQueryT = {
  text?: string
  tags?: string[]
  collectionId?: string
  isLiked?: boolean
  searchValue: string
  key: string
  scale: string
  bpmRange: [number, number]
  lengthRange: [number, number]
  kind: string
  sortBy: string
  sortOrder: string
}
