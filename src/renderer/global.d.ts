type CategoryT = 'instrument' | 'genre' | 'descriptor'
type ScaleT = 'Major' | 'Minor' | 'Dorian' | 'Phrygian' | 'Lydian' | 'Mixolydian' | 'Locrian'
type KeyT = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B'
type SampleTypeT = 'shot' | 'loop'

type DirectoryStateT = {
  folders: FolderT[]
  assets: SampleT[]
  collections: CollectionT[]
  settings: { [key: string]: any }
}

type FolderT = {
  id: string
  path: string
  name: string
  isIndexing: boolean
  dateAdded: number
}

type BaseModelT = {
  id: string
  createdDate: number
  updatedDate: number
}

type UserT = BaseModelT & {
  username: string
  email: string
  avatarUrl: string | null
  description: string | null
  favoritedAssets: string[]
  collections: string[]
  packs: string[]
}

type TagT = BaseModelT & {
  id: string
  label: string
  category: CategoryT
}

type SampleT = BaseModelT & {
  name: string
  user: string
  pack: string
  type: SampleTypeT
  audioUrl: string
  length: number
  key: KeyT | null
  scale: ScaleT | null
  bpm: number | null
  tags: string[]
}

// Collection model (user-created collections of assets)
type CollectionT = BaseModelT & {
  name: string
  description: string
  artworkUrl: string | null
  isPublic: boolean
  userId: string
  assetIds: string[]
  tagIds: string[]
}
