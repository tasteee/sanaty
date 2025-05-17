// export { addFolder } from './api/addFolder'
// export { addToCollection } from './api/addToCollection'
// export { removeFromCollection } from './api/removeFromCollection'
// export { createCollection } from './api/createCollection'
// export { deleteCollection } from './api/deleteCollection'
// export { refreshFolder } from './api/refreshFolder'
// export { removeFolder } from './api/removeFolder'
// export { toggleLiked } from './api/toggleLiked'
// export { getAllCollections } from './api/getAllCollections'
// export { getAllFolders } from './api/getAllFolders'
// export { getAllLikes } from './api/getAllLikes'
// export { searchSamples } from './api/searchSamples'
// export { updateCollection } from './api/updateCollection'

import * as fs from 'fs'
import * as path from 'path'
import * as crypto from 'crypto'
import Loki, { Collection } from 'lokijs'
import LokiFS from 'lokijs/src/loki-fs-structured-adapter'
import { app, shell } from 'electron'
import { dialog } from 'electron'
import { glob } from 'glob'

import { parseSample } from './parseSample'

// Define allowed audio extensions
const ALLOWED_EXTENSIONS = ['.wav', '.mp3']

let db: Loki
let likes: Collection<LikeT>
let folders: Collection<FolderT>
let samples: Collection<SampleT>
let collections: Collection<CollectionT>

const adapter = new LokiFS()
const DB_FILE_PATH = path.join(app.getPath('userData'), 'sampledb.db')

export const initDatabase = (): Promise<void> => {
  return new Promise((resolve) => {
    const autoloadCallback = () => {
      const likesCollection = db.getCollection('likes')
      const createLikesCollection = () => db.addCollection('likes', { indices: ['id'] })
      likes = likesCollection || createLikesCollection()

      const foldersCollection = db.getCollection('folders')
      const createFoldersCollection = () => db.addCollection('folders', { indices: ['id', 'path'] })
      folders = foldersCollection || createFoldersCollection()

      const samplesIndices = ['id', 'folderId', 'name', 'extension', 'sampleType']
      const samplesCollection = db.getCollection('samples')
      const createSamplesCollection = () => db.addCollection('samples', { indices: samplesIndices })
      samples = samplesCollection || createSamplesCollection()

      const collectionsCollection = db.getCollection('collections')
      const createCollectionsCollection = () => db.addCollection('collections', { indices: ['id'] })
      collections = collectionsCollection || createCollectionsCollection()
      console.log('\n\n\nDATABASE LOADED\n\n\n')
      resolve()
    }

    db = new Loki(DB_FILE_PATH, {
      adapter,
      autoload: true,
      autoloadCallback,
      autosave: true,
      autosaveInterval: 5000
    })
  })
}

export async function openAddFolderSelectDialog() {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
    title: 'Select a folder to index'
  })

  if (result.filePaths.length === 0 || result.canceled) return null
  return result.filePaths[0]
}

// Add a folder to the database
export const addFolder = async () => {
  const folderPath = await openAddFolderSelectDialog()
  if (!folderPath) return false

  const existingFolder = folders.findOne({ path: folderPath })
  if (existingFolder) return false

  const folderName = path.basename(folderPath)
  const folderId = crypto.randomUUID()

  const newFolder: FolderT = {
    id: folderId,
    path: folderPath,
    name: folderName,
    sampleCount: 0,
    dateAdded: Date.now()
  }

  folders.insert(newFolder)
  const sampleCount = await processFolderSamples(newFolder)
  console.log('\n\n\ADDED FOLDER ', folderPath, ' and found ', sampleCount, ' samples')
  return newFolder
}

// When user is adding a folder or refreshing a folder.
// Find all the sample file pats recursively in the folder.

function scanFolderSampleFiles(folderPath: string) {
  const globOptions = { stat: true, absolute: true }
  const globString = `${folderPath}/**/*.{mp3,wav}`
  const audioFilePaths = glob.sync(globString, globOptions)
  return audioFilePaths
}

const processFolderSamples = async (folder: FolderT) => {
  const sampleFilePaths = scanFolderSampleFiles(folder.path)

  for (const filePath of sampleFilePaths) {
    const sample = await parseSample(filePath, folder.id)
    samples.insert(sample)
  }

  folder.sampleCount = sampleFilePaths.length
  folders.update(folder)
  return folder.sampleCount
}

export const getAllFolders = (): FolderT[] => {
  return folders.chain().simplesort('dateAdded').data()
}

export const refreshFolder = async (id: string) => {
  const folder = folders.findOne({ id })
  if (!folder) return false
  samples.findAndRemove({ folderId: id })
  const sampleCount = await processFolderSamples(folder)
  console.log('\n\n\nREFRESHED FOLDER ', folder.path, ' and found ', sampleCount, ' samples.')
  return folder
}

// Remove folder
export const removeFolder = (id: string): void => {
  const folder = folders.findOne({ id })
  const folderSamples = samples.find({ folderId: id })
  console.log('removing samples: ', folderSamples.length)

  const sampleIds = folderSamples.map((item) => item.id)
  const allCollections = collections.find()

  const updatedCollections = allCollections.map((collection) => {
    collection.sampleIds = collection.sampleIds.filter((id) => {
      return !sampleIds.includes(id)
    })

    return collection
  })

  updatedCollections.forEach((collection) => {
    collections.update(collection)
  })

  samples.findAndRemove({ folderId: id })
  folders.remove(folder)
  console.log('\n\n\nREMOVED FOLDER ', folder.path)
}

export const getAllLikes = (): string[] => {
  return likes
    .chain()
    .simplesort('id')
    .data()
    .map((like) => like.id)
}

export const toggleLiked = (id: string): boolean => {
  const existingLike = likes.findOne({ id })
  if (existingLike) likes.remove(existingLike)
  if (!existingLike) likes.insert({ id })
  return existingLike ? false : true
}

export const getSampleById = async (id: string) => {
  return samples.findOne({ id })
}

// Search samples
export const searchSamples = (filters: {
  searchValue?: string
  folderId?: string
  isLiked?: boolean
  collectionId?: string
  extensions?: string[]
  sampleTypes?: string[]
  bpmRange?: [number, number]
  durationRange?: [number, number]
  sortBy?: string
  sortOrder?: 'ascending' | 'descending'
  limit?: number
  offset?: number
}) => {
  let chain = samples.chain()
  console.log('\n\n\n SEARCHING SAMPLES ', filters)

  // Apply filters
  if (filters.searchValue && filters.searchValue.trim() !== '') {
    const query = filters.searchValue.toLowerCase()
    chain = chain.find({
      $or: [{ name: { $regex: new RegExp(query, 'i') } }, { tags: { $contains: query } }]
    })
  }

  if (filters.folderId) {
    chain = chain.find({ folderId: filters.folderId })
  }

  if (filters.collectionId) {
    const collection = collections.findOne({ id: filters.collectionId })
    if (collection && collection.sampleIds) {
      chain = chain.find({ id: { $in: collection.sampleIds } })
    }
  }
  if (filters.extensions && filters.extensions.length > 0) {
    chain = chain.find({ extension: { $in: filters.extensions } })
  }

  if (filters.sampleTypes && filters.sampleTypes.length > 0) {
    chain = chain.find({ sampleType: { $in: filters.sampleTypes } })
  }

  if (filters.isLiked === true) {
    const allLikes = likes.find()
    const likedSampleIds = allLikes.map((item) => item.id)
    chain = chain.find({ id: { $in: likedSampleIds } })
  }

  if (filters.bpmRange) {
    const [minBpm, maxBpm] = filters.bpmRange
    chain = chain.find({ bpm: { $between: [minBpm, maxBpm] } })
  }

  if (filters.durationRange) {
    const [minDuration, maxDuration] = filters.durationRange
    chain = chain.find({ duration: { $between: [minDuration, maxDuration] } })
  }

  const sortBy = filters.sortBy || 'name'
  const isDescending = filters.sortOrder === 'descending'
  chain = chain.simplesort(sortBy, { desc: isDescending })

  // Apply pagination
  if (filters.limit !== undefined && filters.offset !== undefined) {
    chain = chain.offset(filters.offset).limit(filters.limit)
  }

  const results = chain.data()
  console.log('\n\n\nSEARCH RESULTS ', results?.length)

  return results
}

// Create collection
export const createCollection = (data: { name: string; description?: string; artworkPath?: string; sampleIds?: string[] }): CollectionT => {
  const newCollection: CollectionT = {
    id: crypto.randomUUID(),
    name: data.name,
    description: data.description || '',
    artworkPath: data.artworkPath || '',
    sampleIds: data.sampleIds || [],
    dateAdded: Date.now()
  }

  collections.insert(newCollection)
  return newCollection
}

// Get all collections
export const getAllCollections = (): CollectionT[] => {
  return collections.chain().simplesort('name').data()
}

// Update collection
export const updateCollection = (id: string, updates: Partial<CollectionT>): CollectionT => {
  const collection = collections.findOne({ id })

  if (!collection) {
    throw new Error('Collection not found')
  }

  // Prevent updating id and dateAdded
  const { id: _, dateAdded: __, ...validUpdates } = updates

  Object.assign(collection, validUpdates)
  collections.update(collection)

  return collection
}

// Delete collection
export const deleteCollection = (id: string): void => {
  const collection = collections.findOne({ id })

  if (!collection) {
    throw new Error('Collection not found')
  }

  collections.remove(collection)
}

// Add sample to collection
export const addToCollection = (id: string, sampleId: string) => {
  const collection = collections.findOne({ id })
  console.log('\n\n\n ADDING TO COLLECTION ', { id, sampleId })
  const isAlreadyInCollection = collection.sampleIds.includes(sampleId)
  if (isAlreadyInCollection) console.log('IS AREADY IN IT')
  if (isAlreadyInCollection) return true

  collection.sampleIds.push(sampleId)
  collections.update(collection)
  console.log('ADDED THAT SHIT TO THE COLLECTION')
  return true
}

// Remove sample from collection
export const removeFromCollection = (id: string, sampleId: string) => {
  console.log('\n\n\nREMOVING FROM COLLECTION', { id, sampleId })
  const collection = collections.findOne({ id })
  console.log('original sampleis length', collection.sampleIds.length)
  collection.sampleIds = collection.sampleIds.filter((id) => id !== sampleId)
  console.log('new sampleis length', collection.sampleIds.length)
  collections.update(collection)
  return true
}

const getAudioData = async (filePath: string) => {
  try {
    const data = await fs.promises.readFile(filePath)
    return [data.buffer, null]
  } catch (error) {
    console.error('Error reading audio file:', error)
    return [null, error]
  }
}

function openExplorerAtFolder(id: string) {
  const folder = folders.findOne({ id })
  shell.openPath(folder.path)
}

export const database = {
  initDatabase,
  addFolder,
  openExplorerAtFolder,
  getAllFolders,
  refreshFolder,
  getAudioData,
  removeFolder,
  getAllLikes,
  toggleLiked,
  searchSamples,
  createCollection,
  getAllCollections,
  updateCollection,
  deleteCollection,
  addToCollection,
  removeFromCollection,
  getSampleById
}
