import DataStore from '@seald-io/nedb'
import { app } from 'electron'
import path from 'path'
import fs from 'fs'
import { glob } from 'glob'
import { list } from '#/modules/list'

const USER_DATA_PATH = app.getPath('userData')
const DB_FOLDERS_FILEPATH = path.join('./', 'sanatyStore-folders.db')
const DB_SAMPLES_FILEPATH = path.join('./', 'sanatyStore-samples.db')
const DB_COLLECTIONS_FILEPATH = path.join('./', 'sanatyStore-collections.db')

const $folders = new DataStore<FolderT>({
  filename: DB_FOLDERS_FILEPATH,
  autoload: true
})

const $samples = new DataStore({
  filename: DB_SAMPLES_FILEPATH,
  autoload: true
})

const $collections = new DataStore({
  filename: DB_COLLECTIONS_FILEPATH,
  autoload: true
})

async function createFolder(folderPath: string) {
  const folderName = path.basename(folderPath)

  return {
    path: folderPath,
    name: folderName,
    createdDate: Date.now()
  } as FolderT
}

async function getAllSamples() {
  const allSamples: SampleT[] = await $samples.findAsync({})
  return allSamples
}

async function getAllFolders() {
  const allFolders: FolderT[] = await $folders.findAsync({})
  return allFolders
}

async function getAllSamplePaths() {
  const allSamples: SampleT[] = await getAllSamples()
  return allSamples.map((sample) => sample.filePath)
}

async function getOnlyNewSampleFilePaths(filePaths: string[]) {
  const existingSampleFilePaths = await getAllSamplePaths()

  return filePaths.filter((sampleFilePath) => {
    return !existingSampleFilePaths.includes(sampleFilePath)
  })
}

// Re-index the samples recusrively in the folder.
// If any samples found have unique paths (no other
// $samples have the same filePath) then those samples
// with unique paths are inserted into the db.
async function refreshFolder(_id: string) {
  const folderDoc = await $folders.findOneAsync({ _id })
  const samplePaths = await getFilePathsInFolder(folderDoc.path)
  const newSampleFilePaths = await getOnlyNewSampleFilePaths(samplePaths)
}

// given a folder path, get all the paths of mp3 or wav
// files recursively inside of the folder
async function getFilePathsInFolder(folderPath: string) {
  const globOptions = { stat: true, absolute: true }
  const globString = `${folderPath}/**/*.{mp3|wav}`
  const audioFilePaths = glob.sync(globString, globOptions)
  return audioFilePaths
}

async function getAllFolderSamples(folderId: string) {
  const allSamples = await getAllSamples()

  return allSamples.filter((sample) => {
    return sample.folderId === folderId
  })
}

async function addSampleToCollection(_id: string, sampleId: string) {
  const collection = await $collections.findOneAsync({ _id })
  const newSampleIds = Array.from(new Set([...collection.sampleIds, sampleId]))
  await $collections.updateAsync({ _id }, { sampleIds: newSampleIds })
}

async function removeSampleFromCollection(_id: string, sampleId: string) {
  const collection = await $collections.findOneAsync({ _id })
  const newSampleIds = collection.sampleIds.filter((assetId) => assetId !== sampleId)
  await $collections.updateAsync({ _id }, { sampleIds: newSampleIds })
}

// get all .wav or .mp3 file paths recursively inside folder.
// ensure that none of the paths already exist on any samples
// in the dataabse. create a new SampleT for each *new*
// sample file path, then bulk add the new SampleTs to the db.
async function indexFolderSamples(folderDoc: FolderT) {
  const samplePaths = await getFilePathsInFolder(folderDoc.path)
  const newSampleFilePaths = await getOnlyNewSampleFilePaths(samplePaths)
  const buildSample = (samplePath) => createSample(samplePath, folderDoc._id) as SampleT
  const sampleDatas = newSampleFilePaths.map(buildSample)
  const sampleDocs = await $samples.insertAsync(sampleDatas)
  const sampleCount = sampleDocs.length
  console.log({ samplePaths, newSampleFilePaths, sampleDatas, sampleDocs, sampleCount })
  return { folderDoc, sampleCount, sampleDocs }
}

async function updateSample(_id: string, updates: Partial<SampleT>) {
  await $samples.updateAsync({ _id }, updates)
}

async function updateCollection(_id: string, updates: Partial<SampleT>) {
  await $collections.updateAsync({ _id }, updates)
}

// Create a FolderT object and then
// insert it to the db so it gets a _id assigned
// and pass it on to use to index samples in the folder
// which will all be added to the db when indexing is done
async function addFolder(folderPath: string) {
  const folderData = await createFolder(folderPath)
  const folderDoc = await $folders.insertAsync(folderData)
  const { sampleCount } = await indexFolderSamples(folderDoc)
  console.log('addFolder ', { folderDoc, sampleCount })
  return true
}

async function getAllCollections() {
  const allCollections: CollectionT[] = await $collections.findAsync({})
  return allCollections
}

// remove sample ids from collections
// delete all samples from db
// delete folder from db
async function removeFolder(_id: string) {
  const folderSamples = await getAllFolderSamples(_id)
  const allCollections = await getAllCollections()
  const folderSampleIds = folderSamples.map((sample) => sample._id)

  for (const collection of allCollections) {
    const newCollectionSampleIds = list(collection.sampleIds).intersect(folderSampleIds)
    const didListChange = collection.sampleIds.length !== newCollectionSampleIds.length
    const updateQuery = { $set: { sampleIds: newCollectionSampleIds } }
    if (didListChange) await $collections.updateAsync({ _id: collection._id }, updateQuery)
  }

  await $samples.removeAsync({ folderId: _id }, { multi: true })
  await $folders.removeAsync({ _id }, {})
}

async function getFolderSampleCount(_id: string) {
  const folderSamples = await getAllFolderSamples(_id)
  console.log('getFolderSampleCount', { _id, folderSamples })
  return folderSamples.length
}

function createSample(filePath: string, folderId: string) {
  const fileName = path.basename(filePath)
  const name = path.parse(fileName).name

  // TODO: Determine what npm packages I can use
  // to determine the duration, bpm, musical key / scale
  // sampleType, and potentially to auto generate
  // tags for the audio file...

  return {
    name, // 'soul-guitar'
    fileName, // 'soul-guitar.wav'
    filePath, // 'C://foo/bar/soul-guitar.wav'
    fileSize: 12345, // bytes
    folderId, // Reference to FolderT._id
    duration: 10,
    bpm: 93,
    key: 'd',
    scale: 'minor',
    sampleType: 'shot',
    tags: [],
    createdDate: Date.now()
  }
}

async function getCollectionAssets(_id: string) {
  const collection = await $collections.findOneAsync({ _id })
  const sampleIds = collection.sampleIds
  return $samples.findAsync({ _id: { $in: sampleIds } })
}

async function createCollection(data: CollectionT) {
  return await $collections.insertAsync(data)
}

async function deleteCollection(_id) {
  await $collections.removeAsync({ _id }, {})
}

type SampleSearchQueryT = {
  text?: string
  durationRange?: [number, number]
  bpmRange?: [number, number]
  key?: string
  scale?: string
  sampleType?: string
  tags?: string[]
  sortBy: 'name' | 'duration' | 'bpm' | 'createdDate'
  sortOrder: 'ascending' | 'descending'
}

async function searchSamples(filters: SampleSearchQueryT) {
  const query = {} as any
  if (filters.text) query.name = { $regex: filters.text, $options: 'i' }
  if (filters.bpmRange) query.bpm = { $gte: filters.bpmRange[0], $lte: filters.bpmRange[1] }
  if (filters.durationRange) query.duration = { $gte: filters.durationRange[0], $lte: filters.durationRange[1] }
  if (filters.key) query.key = filters.key
  if (filters.scale) query.scale = filters.scale
  if (filters.sampleType) query.sampleType = filters.sampleType
  if (filters.tags) query.tags = { $in: filters.tags }
  const sortQuery = { [filters.sortBy]: filters.sortOrder === 'ascending' ? 1 : -1 }
  const samples = await $samples.findAsync(query).sort(sortQuery)
  return samples
}

export const database = {
  addFolder,
  removeFolder,
  createFolder,
  refreshFolder,
  getAllFolders,
  getAllSamples,
  searchSamples,
  deleteCollection,
  getAllCollections,
  getFolderSampleCount,
  getFilePathsInFolder,
  createCollection,
  getAllFolderSamples,
  getAllSamplePaths,
  getOnlyNewSampleFilePaths,
  getCollectionAssets,
  createSample,
  indexFolderSamples,
  addSampleToCollection,
  removeSampleFromCollection,
  updateCollection,
  updateSample
}
