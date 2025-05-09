import DataStore from '@seald-io/nedb'
import { app } from 'electron'
import path from 'path'
import fs from 'fs'

import { IS_DEV_ENV } from '../constants'

const USER_DATA_PATH = IS_DEV_ENV ? './' : app.getPath('userData')
const DB_FOLDERS_FILEPATH = path.join(USER_DATA_PATH, 'sanatyStore-folders.db')
const DB_SAMPLES_FILEPATH = path.join(USER_DATA_PATH, 'sanatyStore-samples.db')
const DB_COLLECTIONS_FILEPATH = path.join(USER_DATA_PATH, 'sanatyStore-collections.db')
const LIKED_SAMPLE_IDS_FILEPATH = path.join(USER_DATA_PATH, 'sanatyStore-likes.json')

export const $folders = new DataStore<FolderT>({
  filename: DB_FOLDERS_FILEPATH,
  autoload: true
})

export const $samples = new DataStore({
  filename: DB_SAMPLES_FILEPATH,
  autoload: true
})

export const $collections = new DataStore({
  filename: DB_COLLECTIONS_FILEPATH,
  autoload: true
})

// Add this code before the loadJsonFile function
const ensureLikesFileExists = () => {
  if (!fs.existsSync(LIKED_SAMPLE_IDS_FILEPATH)) {
    fs.writeFileSync(LIKED_SAMPLE_IDS_FILEPATH, JSON.stringify([], null, 2), 'utf8')
  }
}

const loadJsonFile = (filePath: string) => {
  const stringData = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(stringData)
}

export const $likes = (() => {
  ensureLikesFileExists()
  const likedSampleIdsArray = loadJsonFile(LIKED_SAMPLE_IDS_FILEPATH)
  const likes = new Set(likedSampleIdsArray)

  function saveLikedSampleIds() {
    const data = JSON.stringify(Array.from(likes), null, 2)
    fs.writeFileSync(LIKED_SAMPLE_IDS_FILEPATH, data, 'utf8')
  }

  function toggle(id: string) {
    const isLiked = likes.has(id)
    if (isLiked) likes.delete(id)
    if (!isLiked) likes.add(id)
    saveLikedSampleIds()
  }

  return {
    toggle,

    get list() {
      return Array.from(likes)
    }
  }
})()
