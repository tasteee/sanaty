import { JSONFilePreset } from 'lowdb/node'
import { app } from 'electron'
import path from 'path'
import { IS_DEV_ENV } from '../constants'

const USER_DATA_PATH = IS_DEV_ENV ? './' : app.getPath('userData')
const DB_FOLDERS_FILEPATH = path.join(USER_DATA_PATH, 'sanatyStore-folders.json')
const DB_SAMPLES_FILEPATH = path.join(USER_DATA_PATH, 'sanatyStore-samples.json')
const DB_COLLECTIONS_FILEPATH = path.join(USER_DATA_PATH, 'sanatyStore-collections.json')
const LIKED_SAMPLE_IDS_FILEPATH = path.join(USER_DATA_PATH, 'sanatyStore-likes.json')

// Define the types for each database
type FoldersDB = FolderT[]
type SamplesDB = SampleT[]
type CollectionsDB = CollectionT[]
type LikesDB = string[]

// Create the database instances with default values
export const $folders = JSONFilePreset<FoldersDB>(DB_FOLDERS_FILEPATH, [])
export const $samples = JSONFilePreset<SamplesDB>(DB_SAMPLES_FILEPATH, [])
export const $likes = JSONFilePreset<LikesDB>(LIKED_SAMPLE_IDS_FILEPATH, [])
export const $collections = JSONFilePreset<CollectionsDB>(DB_COLLECTIONS_FILEPATH, [])
