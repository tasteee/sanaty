type FolderT = {
  _id: string // uuidv4
  id: string
  path: string // C://foo/bar/baz
  name: string // baz
  sampleCount?: number
  artworkUrl?: string
  createdDate: number // Date.now()
  lastIndexedDate: number
}

type SampleT = {
  _id: string
  id: string
  name: string
  fileName: string
  filePath: string
  fileSize: number
  fileExtension: string
  folderId: string
  duration: number
  bpm: number
  key: string
  scale: string
  sampleType: string
  tags: string[]
  createdDate: number
}

type CollectionT = {
  _id: string
  id: string
  name: string
  description: string
  artworkPath: string
  sampleIds: string[]
  createdDate: number
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
  createdDate: number // Date.now()
}
