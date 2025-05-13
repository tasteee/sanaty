import { ColumnType, Generated, Insertable, JSONColumnType, Selectable, Updateable } from 'kysely'

export type DatabaseT = {
  folder: FolderTableT
  sample: SamplTableT
}

export type FolderTableT = {
  id: Generated<number>
  name: string
  path: string
  artworkUrl: string
  sampleCount: number
  lastIndexedDate: number
  createdDate: number
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
//
// Most of the time you should trust the type inference and not use explicit
// types at all. These types can be useful when typing function arguments.
export type DBFolderT = Selectable<FolderTableT>
export type DBNewFolderT = Insertable<FolderTableT>
export type DBFolderUpdateT = Updateable<FolderTableT>

export type SamplTableT = {
  id: Generated<number>
  name: string
  path: string
  kind: string

  createdDate: number
}

export type Pet = Selectable<SamplTableT>
export type NewPet = Insertable<SamplTableT>
export type PetUpdate = Updateable<SamplTableT>

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
