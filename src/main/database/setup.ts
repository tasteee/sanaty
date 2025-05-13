import { app } from 'electron'
import path from 'path'

import { IS_DEV_ENV } from '../constants'
import { loadStore } from './base'

const USER_DATA_PATH = IS_DEV_ENV ? './_sanatyData' : app.getPath('userData')
const DB_FOLDERS_FILEPATH = path.join(USER_DATA_PATH, 'sanatyStore-folders.json')
const DB_SAMPLES_FILEPATH = path.join(USER_DATA_PATH, 'sanatyStore-samples.json')
const DB_COLLECTIONS_FILEPATH = path.join(USER_DATA_PATH, 'sanatyStore-collections.json')
const DB_LIKES_FILEPATH = path.join(USER_DATA_PATH, 'sanatyStore-likes.json')

export const $likes = loadStore<'likes', LikeT>({
  key: 'likes',
  filePath: DB_LIKES_FILEPATH,
  defaultData: []
})

export const $folders = loadStore<'folders', FolderT>({
  key: 'folders',
  filePath: DB_FOLDERS_FILEPATH,
  defaultData: []
})

export const $collections = loadStore<'collections', CollectionT>({
  key: 'collections',
  filePath: DB_COLLECTIONS_FILEPATH,
  defaultData: []
})

export const $samples = loadStore<'samples', SampleT>({
  key: 'samples',
  filePath: DB_SAMPLES_FILEPATH,
  defaultData: []
})
