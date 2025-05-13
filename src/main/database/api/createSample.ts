import path from 'path'

// TODO: Determine what npm packages I can use
// to determine the duration, bpm, musical key / scale
// sampleType, and potentially to auto generate
// tags for the audio file...

// When the user adds a folder for sanaty to index,
// or when the user refreshes a folder and previously
// not-found samples are now found, create a new
// sample document for each found sample file.

export function createSample(filePath: string, folderId: string) {
  const fullName = path.basename(filePath)
  const name = path.parse(fullName).name
  const extension = path.parse(fullName).ext
  const duration = 12 // TODO: Determine how many seconds long the sample is.
  const bpm = 93 // TODO: Determine the BPM of the sample.
  const key = 'd' // TODO: Determine the key of the sample.
  const scale = 'minor' // TODO: Determine the scale of the sample.
  const sampleType = 'shot' // TODO: Determine the type of sample.
  const tags = [] // TODO: Determine the tags for the sample.

  return {
    id: crypto.randomUUID(),
    name: name,
    path: filePath,
    fullName,
    size: 12345,
    extension,
    folderId,
    duration,
    bpm,
    key,
    scale,
    sampleType,
    tags,
    dateAdded: Date.now()
  } as SampleT
}
