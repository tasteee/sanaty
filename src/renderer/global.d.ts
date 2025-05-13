type DataStoreT = {
  likes: LikeT[]
  folders: FolderT[]
  samples: Sample[]
  collections: CollectionT[]
}

type LikeT = {
  id: string // id of the sample that is liked
}

type FolderT = {
  id: string
  path: string
  name: string
  sampleCount: number
  dateAdded: number
}

type SampleT = {
  id: string
  name: string
  path: string
  fullName: string
  size: number
  extension: string
  folderId: string
  duration: number
  bpm: number
  tonic: string
  scale: string
  sampleType: string
  tags: string[]
  dateAdded: number
}

type CollectionT = {
  id: string
  name: string
  description: string
  artworkPath: string
  sampleIds: string[]
  dateAdded: number
}

// NOT A DATABASE DATA TYPE.
// THESE ARE STATIC AND LOADED AT RUNTIME.
// SampleT.tags is an array of TagT ids.
// Those ids are used to look up tag data
// objects in the UI for rendering them
// as different colors and such based
// on their categories.
type TagT = {
  id: string // 'future-bass'
  label: string // 'future bass'
  category: string // 'genre' | 'instrument' | 'descriptor'
  dateAdded: number // Date.now()
}
