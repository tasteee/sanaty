type FolderT = {
  _id: string // uuidv4
  path: string // C://foo/bar/baz
  name: string // baz
  createdDate: number // Date.now()
}

type SampleT = {
  _id: string // uuidv4
  name: string
  fileName: string
  filePath: string
  fileSize: number
  fileExtension: string
  folderId: string // Reference to FolderT._id
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
  name: string
  description: string
  artworkPath: string
  sampleIds: string[]
  createdDate: number
}

// NOT A DATABASE DATA TYPE.
// THESE ARE STATIC AND LOADED AT RUNTIME.
// SampleT.tags is an array of TagT _ids.
// Those _ids are used to look up tag data
// objects in the UI for rendering them
// as different colors and such based
// on their categories.
type TagT = {
  _id: string // 'future-bass'
  label: string // 'future bass'
  category: string // 'genre' | 'instrument' | 'descriptor'
  createdDate: number // Date.now()
}
