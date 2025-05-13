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

import range from 'array-range'
import * as fs from 'fs'
import * as path from 'path'
import * as crypto from 'crypto'
import Loki, { Collection } from 'lokijs'
import LokiFS from 'lokijs/src/loki-fs-structured-adapter'
import { app } from 'electron'
import { dialog } from 'electron'
import { glob } from 'glob'
import random from 'just-random'
import { TAGS } from '#/constants'

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

  console.log('\n\n\nADDING FOLDER ', folderPath)
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

function getRandomScale() {
  return random([
    'major',
    'minor',
    'harmonicMinor',
    'melodicMinor',
    'dorian',
    'phrygian',
    'lydian',
    'mixolydian',
    'locrian',
    'pentatonicMajor',
    'pentatonicMinor',
    'blues'
  ])
}

function getRandomTonic() {
  return random(['a', 'a#', 'b', 'c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#'])
}

function getRandomTag() {
  return random(TAGS.LIST)
}

function getRandomSampletype() {
  return random(['shot', 'loop'])
}

function getRandomTags() {
  return [getRandomTag().id, getRandomTag().id, getRandomTag().id, getRandomTag().id, getRandomTag().id]
}

const processFolderSamples = async (folder: FolderT) => {
  const sampleFilePaths = scanFolderSampleFiles(folder.path)

  for (const filePath of sampleFilePaths) {
    const stats = fs.statSync(filePath)
    const extension = path.extname(filePath).toLowerCase()
    const duration = random(range(1, 30)) as number
    const bpm = random(range(70, 160)) as number
    const fileName = path.basename(filePath, extension)
    const fullName = path.basename(filePath)

    const sample: SampleT = {
      id: crypto.randomUUID(),
      fullName,
      name: fileName,
      path: filePath,
      size: stats.size,
      extension: extension.substring(1),
      folderId: folder.id,
      duration,
      bpm,
      tonic: getRandomTonic(),
      scale: getRandomScale(),
      sampleType: getRandomSampletype(),
      tags: getRandomTags(),
      dateAdded: Date.now()
    }

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
  console.log('\n\n\n TOGGLING LIKE ', id)
  const existingLike = likes.findOne({ id })
  console.log('IS ALREADY LIKED? ', !!existingLike)
  if (existingLike) likes.remove(existingLike)
  if (!existingLike) likes.insert({ id })
  console.log('IS NOW LIKED? ', !existingLike)
  return existingLike ? false : true
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
  sortDirection?: 'asc' | 'desc'
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

  // Apply sorting
  if (filters.sortBy) {
    chain = chain.simplesort(filters.sortBy, { desc: filters.sortDirection === 'desc' })
  } else {
    chain = chain.simplesort('name')
  }

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
  const collection = collections.findOne({ id })
  collection.sampleIds = collection.sampleIds.filter((id) => id !== sampleId)
  collections.update(collection)
  return true
}

export const database = {
  initDatabase,
  addFolder,
  getAllFolders,
  refreshFolder,
  removeFolder,
  getAllLikes,
  toggleLiked,
  searchSamples,
  createCollection,
  getAllCollections,
  updateCollection,
  deleteCollection,
  addToCollection,
  removeFromCollection
}
