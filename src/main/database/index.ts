import fs from 'fs'
import path from 'path'
import { glob } from 'glob'
import * as databases from './setup'
import { dialog } from 'electron'
import { of } from 'await-of'



export const api = async () => {
  const $folders = await databases.$folders
  const $samples = await databases.$samples
  const $collections = await databases.$collections
  const $likes = await databases.$likes

  function openFolderSelectDialog() {
    return dialog.showOpenDialog({
      properties: ['openDirectory'],
      title: 'Select a folder to index'
    })
  }

  async function findSamplesInFolder(folderPath: string) {
    const globOptions = { stat: true, absolute: true }
    const globString = `${folderPath}/**/*.{mp3,wav,MP3,WAV}`
    const audioFilePaths = glob.sync(globString, globOptions)
    return audioFilePaths || []
  }

  async function checkHasFolderBeenAdded(filePath: string) {
    return $folders.data.some((folder: FolderT) => folder.path === filePath)
  }

  async function toggleLike(assetId: string) {
    await $likes.data.
  }
async function getAllSamplesWithFolderId(id) {
  return $samples.data.samples.filter(sample => sample.folderId === id) || []
}

async function getAllCollections() {
  return $collections.data.collections
}

async function getAllLikes() {
  return $likes.list
}

//
// create*
//

// Build the base FolderT object.
async function createFolder(folderPath: string, folderId, sampleCount: number) {
  const folderName = path.basename(folderPath)

  return {
    _id: folderId,
    id: folderId,
    path: folderPath,
    name: folderName,
    sampleCount,
    lastIndexedDate: Date.now(),
    artworkUrl: 'https://placehold.co/400',
    createdDate: Date.now()
  } as FolderT
}

// Create the SampleT object to store in db.
function createSample(filePath: string, folderId: string) {
  const fileName = path.basename(filePath)
  const name = path.parse(fileName).name
  const fileExtension = path.extname(fileName).replace('.', '')
  const id = crypto.randomUUID()

  // TODO: Determine what npm packages I can use
  // to determine the duration, bpm, musical key / scale
  // sampleType, and potentially to auto generate
  // tags for the audio file...

  return {
    id,
    _id: id,
    name, // 'soul-guitar'
    fileName, // 'soul-guitar.wav'
    filePath, // 'C://foo/bar/soul-guitar.wav'
    fileSize: 12345, // bytes
    folderId, // Reference to FolderT._id
    fileExtension,
    duration: 10,
    bpm: 93,
    key: 'd',
    scale: 'minor',
    sampleType: 'shot',
    tags: [],
    createdDate: Date.now()
  }
}

async function createCollection(data: CollectionT) {
  const id = crypto.randomUUID()
  const newCollection = { ...data, _id: id, id, sampleIds: [] }
  $collections.data.collections.push(newCollection)
  await $collections.write()
  return newCollection
}

//
// update*
//

// Get all paths from sample objects in the DB.
async function getAllSamplePaths() {
  const allSamples: SampleT[] = await getAllSamples()
  return allSamples.map((sample) => sample.filePath)
}

async function getOnlyNewSampleFilePaths(filePaths: string[] = []) {
  const existingSampleFilePaths = await getAllSamplePaths()

  return filePaths.filter((sampleFilePath) => {
    return !existingSampleFilePaths.includes(sampleFilePath)
  })
}

// given a folder path, get all the paths of mp3 or wav
// files recursively inside of the folder
async function getFilePathsInFolder(folderPath: string) {
  const globOptions = { stat: true, absolute: true }
  const globString = `${folderPath}/**/*.{mp3,wav,MP3,WAV}`
  const audioFilePaths = glob.sync(globString, globOptions)
  return audioFilePaths || []
}

async function addSampleToCollection(_id: string, sampleId: string) {
  const collectionIndex = $collections.data.collections.findIndex(c => c._id === _id)
  if (collectionIndex === -1) return
  
  const collection = $collections.data.collections[collectionIndex]
  const sampleIds = collection.sampleIds || []
  const newSampleIds = Array.from(new Set([...sampleIds, sampleId]))
  
  $collections.data.collections[collectionIndex].sampleIds = newSampleIds
  await $collections.write()
}

async function removeSampleFromCollection(_id: string, sampleId: string) {
  const collectionIndex = $collections.data.collections.findIndex(c => c._id === _id)
  if (collectionIndex === -1) return
  
  const collection = $collections.data.collections[collectionIndex]
  const sampleIds = collection.sampleIds || []
  const newSampleIds = sampleIds.filter((assetId) => assetId !== sampleId)
  
  $collections.data.collections[collectionIndex].sampleIds = newSampleIds
  await $collections.write()
}

// get all .wav or .mp3 file paths recursively inside folder.
// ensure that none of the paths already exist on any samples
// in the dataabse. create a new SampleT for each *new*
// sample file path, then bulk add the new SampleTs to the db.
async function indexFolderSamples(folderPath: string, folderId) {
  const buildSample = (samplePath) => createSample(samplePath, folderId) as SampleT
  const samplePaths = await getFilePathsInFolder(folderPath)
  const newSampleFilePaths = await getOnlyNewSampleFilePaths(samplePaths)
  const sampleDatas = newSampleFilePaths.map(buildSample)
  
  $samples.data.samples.push(...sampleDatas)
  await $samples.write()
  
  const sampleCount = samplePaths.length
  return { sampleCount, sampleDocs: sampleDatas }
}

// Re-index the samples recusrively in the folder.
// If any samples found have unique paths (no other
// $samples have the same filePath) then those samples
// with unique paths are inserted into the db.
async function refreshFolder(_id: string) {
  const folderDoc = $folders.data.folders.find(f => f._id === _id)
  if (!folderDoc) return null
  
  const existingSamples = await getAllSamplesWithFolderId(_id)
  const actualFilePaths = await getFilePathsInFolder(folderDoc.path)
  const actualFilePathSet = new Set(actualFilePaths)

  // Remove samples that no longer exist on disk
  const missingSamples = existingSamples.filter((s) => !actualFilePathSet.has(s.filePath))
  const missingSampleIds = missingSamples.map((s) => s._id)

  // Remove missing samples from db.
  // Remove missing sample ids from collections.
  if (missingSampleIds.length > 0) {
    await removeSamplesByIds(missingSampleIds)
    await removeSamplesFromCollections(missingSampleIds)
  }

  // Index any new files
  const { sampleCount } = await indexFolderSamples(folderDoc.path, folderDoc._id)
  
  // Update folder sample count
  const folderIndex = $folders.data.folders.findIndex(f => f._id === _id)
  if (folderIndex !== -1) {
    $folders.data.folders[folderIndex].sampleCount = sampleCount
    await $folders.write()
  }
  
  const newFolderDoc = $folders.data.folders.find(f => f._id === _id)
  return newFolderDoc
}

async function removeSamplesByIds(sampleIds: string[]) {
  const idsSet = new Set(sampleIds)
  $samples.data.samples = $samples.data.samples.filter(sample => !idsSet.has(sample._id))
  await $samples.write()
}

async function removeSamplesByFolderId(folderId: string) {
  $samples.data.samples = $samples.data.samples.filter(sample => sample.folderId !== folderId)
  await $samples.write()
}

async function updateCollection(_id, updates) {
  const [result, error] = await of(async () => {
    const collectionIndex = $collections.data.collections.findIndex(c => c._id === _id)
    if (collectionIndex === -1) throw new Error('Collection not found')
    
    $collections.data.collections[collectionIndex] = {
      ...$collections.data.collections[collectionIndex],
      ...updates
    }
    
    await $collections.write()
    return $collections.data.collections[collectionIndex]
  })
  
  if (error) return { error, result: null }
  return { result, error: null }
}

// Create a FolderT object and then
// insert it to the db so it gets a _id assigned
// and pass it on to use to index samples in the folder
// which will all be added to the db when indexing is done
async function addFolder() {
  const result = await openFolderSelectDialog()
  const noFolderWasSelected = result.filePaths.length === 0
  const selectionWasCanceled = result.canceled
  const shouldExit = selectionWasCanceled || noFolderWasSelected
  if (shouldExit) return null

  const folderPath = result.filePaths[0]
  const isAlreadyAdded = await checkHasFolderBeenAdded(folderPath)
  if (isAlreadyAdded) return false

  const folderId = crypto.randomUUID()
  const { sampleCount } = await indexFolderSamples(folderPath, folderId)
  const folderData = await createFolder(folderPath, folderId, sampleCount)
  
  $folders.data.folders.push(folderData)
  await $folders.write()
  
  return true
}

async function removeSamplesFromCollections(sampleIds: string[]) {
  const allCollections = await getAllCollections()
  const idsSet = new Set(sampleIds)
  let hasChanges = false

  for (let i = 0; i < allCollections.length; i++) {
    const collection = allCollections[i]
    const currentSampleIds = collection.sampleIds || []
    const newCollectionSampleIds = currentSampleIds.filter((id) => !idsSet.has(id))
    const didListChange = currentSampleIds.length !== newCollectionSampleIds.length
    
    if (didListChange) {
      $collections.data.collections[i].sampleIds = newCollectionSampleIds
      hasChanges = true
    }
  }

  if (hasChanges) {
    await $collections.write()
  }
}

// find all SampleT ids in db related to the given folder id.
// remove found sample ids from any collection's assetIds list.
// remove all corresponding SampleT ojects from db.
// delete corresponding folder from db
async function removeFolder(_id: string) {
  const folderSamples = await getAllSamplesWithFolderId(_id)
  const folderSampleIds = folderSamples.map((sample) => sample._id)
  await removeSamplesFromCollections(folderSampleIds)
  await removeSamplesByFolderId(_id)
  
  $folders.data.folders = $folders.data.folders.filter(folder => folder._id !== _id)
  await $folders.write()
}

async function getCollectionAssets(_id: string) {
  const collection = $collections.data.collections.find(c => c._id === _id)
  if (!collection) return []
  
  const sampleIds = collection.sampleIds || []
  const idsSet = new Set(sampleIds)
  return $samples.data.samples.filter(sample => idsSet.has(sample._id))
}

async function deleteCollection(_id) {
  $collections.data.collections = $collections.data.collections.filter(c => c._id !== _id)
  await $collections.write()
}

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
  collectionId?: string
  folderId?: string
}

async function searchSamples(filters: SampleSearchQueryT) {
  console.log('searchSamples with: ', filters)

  let samples = [...$samples.data.samples]
  const likes = $likes.list

  // Handle collection filter first
  if (filters.collectionId) {
    const collection = $collections.data.collections.find(c => c._id === filters.collectionId)
    if (!collection) return [] // Collection doesn't exist
    
    const collectionSampleIds = new Set(collection.sampleIds || [])
    samples = samples.filter(sample => collectionSampleIds.has(sample._id))
  }

  // Apply all other filters
  samples = samples.filter(sample => {
    // BPM range filter
    if (sample.bpm < filters.bpmMin || sample.bpm > filters.bpmMax) return false
    
    // Duration range filter
    if (sample.duration < filters.durationMin || sample.duration > filters.durationMax) return false
    
    // Folder filter
    if (filters.folderId && sample.folderId !== filters.folderId) return false
    
    // Key filter
    if (filters.key !== 'any' && sample.key !== filters.key) return false
    
    // Scale filter
    if (filters.scale !== 'any' && sample.scale !== filters.scale) return false
    
    // Sample type filter
    if (filters.sampleType !== 'any' && sample.sampleType !== filters.sampleType) return false
    
    // Search value filter
    if (filters.searchValue && !sample.name.toLowerCase().includes(filters.searchValue.toLowerCase())) return false
    
    // Tags filter
    if (filters.tags?.length && !filters.tags.some(tag => sample.tags.includes(tag))) return false
    
    return true
  })

  // Apply sorting
  samples.sort((a, b) => {
    const direction = filters.sortOrder === 'ascending' ? 1 : -1
    const valueA = a[filters.sortBy]
    const valueB = b[filters.sortBy]
    
    if (typeof valueA === 'string') {
      return direction * valueA.localeCompare(valueB)
    }
    
    return direction * (valueA - valueB)
  })

  // Apply like filtering last
  const final = filters.isLiked ? samples.filter(s => likes.includes(s.id)) : samples
  console.log({ final })
  return final
}

async function getCollectionSampleCount(_id: string) {
  const collection = $collections.data.collections.find(c => c._id === _id)
  if (!collection) return 0
  
  const sampleIds = collection.sampleIds || []
  return sampleIds.length
}

// Count the samples in the DB that belong to the folder id provided.
async function getFolderSampleCount(_id: string) {
  const folderSamples = await getAllSamplesWithFolderId(_id)
  return folderSamples.length
}

async function verifyFoldersAndSamples() {
  const missingFolderIds = []
  const missingSampleIds = []

  // Check all folders
  const allFolders = $folders.data
  const allSamples = await getAllSamples()

  for (const folder of allFolders) {
    if (!fs.existsSync(folder.path)) {
      missingFolderIds.push(folder._id)
    }
  }

  // Check all samples
  for (const sample of allSamples) {
    if (!fs.existsSync(sample.filePath)) {
      missingSampleIds.push(sample._id)
    }
  }

  const missingFolders = allFolders.filter(folder => missingFolderIds.includes(folder._id))
  const missingSamples = allSamples.filter(sample => missingSampleIds.includes(sample._id))
  const final = { missingFolders, missingSamples, missingFolderIds, missingSampleIds }
  return final
}
}

//
// helpers
//








// export const database = {
//   addFolder,
//   removeFolder,
//   createFolder,
//   refreshFolder,
//   getAllFolders,
//   getAllSamples,
//   verifyFoldersAndSamples,
//   searchSamples,
//   deleteCollection,
//   getAllCollections,
//   getCollectionSampleCount,
//   getFolderSampleCount,
//   getFilePathsInFolder,
//   createCollection,
//   getAllSamplePaths,
//   createSample,
//   getOnlyNewSampleFilePaths,
//   getCollectionAssets,
//   getAllSamplesWithFolderId,
//   indexFolderSamples,
//   addSampleToCollection,
//   removeSampleFromCollection,
//   toggleAssetLiked,
//   getAllLikes,
//   updateCollection
// }