import fs from 'fs'
import path from 'path'
import { glob } from 'glob'
import { $likes, $folders, $samples, $collections } from './setup'
import { dialog } from 'electron'
import { of } from 'await-of'

//
// helpers
//

function openFolderSelectDialog() {
  return dialog.showOpenDialog({
    properties: ['openDirectory'],
    title: 'Select a folder to index'
  })
}

async function checkHasFolderBeenAdded(folderPath: string) {
  const existingFolders = await getAllFolders()
  return existingFolders.some((folder: FolderT) => folder.path === folderPath)
}

async function toggleAssetLiked(id: string) {
  await $likes.toggle(id)
  return $likes.list
}

//
// getAll*
//

async function getAllFolders() {
  const allFolders: FolderT[] = await $folders.findAsync({})
  return allFolders
}

async function getAllSamples() {
  const allSamples: SampleT[] = await $samples.findAsync({})
  return allSamples || []
}

async function getAllSamplesWithFolderId(id) {
  const results: SampleT[] = await $samples.findAsync({ folderId: id })
  return results || []
}

async function getAllCollections() {
  const allCollections: CollectionT[] = await $collections.findAsync({})
  return allCollections
}

async function getAllLikes() {
  return await $likes.list
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
  return await $collections.insertAsync({ ...data, _id: id, id, sampleIds: [] })
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
  const collection = await $collections.findOneAsync({ _id })
  const sampleIds = collection.sampleIds || []
  const newSampleIds = Array.from(new Set([...sampleIds, sampleId]))
  await $collections.updateAsync({ _id }, { sampleIds: newSampleIds })
}

async function removeSampleFromCollection(_id: string, sampleId: string) {
  const collection = await $collections.findOneAsync({ _id })
  const sampleIds = collection.sampleIds || []
  const newSampleIds = sampleIds.filter((assetId) => assetId !== sampleId)
  await $collections.updateAsync({ _id }, { sampleIds: newSampleIds })
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
  const sampleDocs = await $samples.insertAsync(sampleDatas)
  const sampleCount = samplePaths.length
  return { sampleCount, sampleDocs }
}

// Re-index the samples recusrively in the folder.
// If any samples found have unique paths (no other
// $samples have the same filePath) then those samples
// with unique paths are inserted into the db.
async function refreshFolder(_id: string) {
  const folderDoc = await $folders.findOneAsync({ _id })
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
  await $folders.updateAsync({ _id }, { $set: { sampleCount } })
  const newFolderDoc = await $folders.findOneAsync({ _id })
  return newFolderDoc
}

function removeSamplesByIds(sampleIds: string[]) {
  return $samples.removeAsync({ _id: { $in: sampleIds } }, { multi: true })
}

function removeSamplesByFolderId(folderId: string) {
  return $samples.removeAsync({ folderId }, { multi: true })
}

async function updateCollection(_id, updates) {
  const [result, error] = await of($collections.updateAsync({ _id }, { $set: updates }))
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
  // const folderData = await createFolder(folderId, folderPath, sampleCount)
  const folderData = await createFolder(folderPath, folderId, sampleCount)
  const folderDoc = await $folders.insertAsync(folderData)
  return true
}

async function removeSamplesFromCollections(sampleIds: string[]) {
  const allCollections = await getAllCollections()

  for (const collection of allCollections) {
    const currentSampleIds = collection.sampleIds || []
    const newCollectionSampleIds = currentSampleIds.filter((id) => !sampleIds.includes(id))
    const didListChange = currentSampleIds.length !== newCollectionSampleIds.length
    const updateQuery = { $set: { sampleIds: newCollectionSampleIds } }
    if (didListChange) await $collections.updateAsync({ _id: collection._id }, updateQuery)
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
  await $folders.removeAsync({ _id }, {})
}

async function getCollectionAssets(_id: string) {
  const collection = await $collections.findOneAsync({ _id })
  const sampleIds = collection.sampleIds || []
  return $samples.findAsync({ _id: { $in: sampleIds } })
}

async function deleteCollection(_id) {
  await $collections.removeAsync({ _id }, {})
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
}

async function searchSamples(filters: SampleSearchQueryT) {
  const query = {} as any
  query.bpm = { $gte: filters.bpmMin, $lte: filters.bpmMax }
  query.duration = { $gte: filters.durationMin, $lte: filters.durationMax }
  if (filters.key !== 'any') query.key = filters.key
  if (filters.scale !== 'any') query.scale = filters.scale
  if (filters.sampleType !== 'any') query.sampleType = filters.sampleType
  if (filters.searchValue) query.name = { $regex: filters.searchValue, $options: 'i' }
  if (filters.tags && filters.tags.length > 0) query.tags = { $in: filters.tags }
  const sortQuery = { [filters.sortBy]: filters.sortOrder === 'ascending' ? 1 : -1 }
  const samples = await $samples.findAsync(query).sort(sortQuery)
  if (!filters.isLiked) return samples

  return samples.filter((sample) => {
    return $likes.list.includes(sample.id)
  })
}

async function getCollectionSampleCount(_id: string) {
  const collection = await $collections.findOneAsync({ _id })
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
  const allFolders = await getAllFolders()
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

  const missingFolders = await $folders.findAsync({ _id: { $in: missingFolderIds } })
  const missingSamples = await $samples.findAsync({ _id: { $in: missingSampleIds } })
  const final = { missingFolders, missingSamples, missingFolderIds, missingSampleIds }
  console.log({ ...final })
  return final
}

export const database = {
  addFolder,
  removeFolder,
  createFolder,
  refreshFolder,
  getAllFolders,
  getAllSamples,
  verifyFoldersAndSamples,
  searchSamples,
  deleteCollection,
  getAllCollections,
  getCollectionSampleCount,
  getFolderSampleCount,
  getFilePathsInFolder,
  createCollection,
  getAllSamplePaths,
  createSample,
  getOnlyNewSampleFilePaths,
  getCollectionAssets,
  getAllSamplesWithFolderId,
  indexFolderSamples,
  addSampleToCollection,
  removeSampleFromCollection,
  toggleAssetLiked,
  getAllLikes,
  updateCollection
}
