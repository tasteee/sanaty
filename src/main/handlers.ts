// src/main/handlers.ts
import { ipcMain, dialog, shell } from 'electron'
import { database } from './database'

function createHandler(key, handle) {
  const handler = async (_, ...args) => handle(...args)
  return ipcMain.handle(key, handler)
}

function openExplorerAtPath(filePath: string) {
  shell.openPath(filePath)
}

export const setupIpcHandlers = () => {
  createHandler('openExplorerAtPath', openExplorerAtPath)
  createHandler('addFolder', database.addFolder)
  createHandler('getAllLikes', database.getAllLikes)
  createHandler('toggleAssetLiked', database.toggleAssetLiked)
  createHandler('getFolderSampleCount', database.getFolderSampleCount)
  createHandler('searchSamples', database.searchSamples)
  createHandler('removeFolder', database.removeFolder)
  createHandler('createFolder', database.createFolder)
  createHandler('refreshFolder', database.refreshFolder)
  createHandler('getAllFolders', database.getAllFolders)
  createHandler('getAllSamples', database.getAllSamples)
  createHandler('deleteCollection', database.deleteCollection)
  createHandler('getAllCollections', database.getAllCollections)
  createHandler('getFilePathsInFolder', database.getFilePathsInFolder)
  createHandler('createCollection', database.createCollection)
  createHandler('getAllSamplesWithFolderId', database.getAllSamplesWithFolderId)
  createHandler('getAllSamplePaths', database.getAllSamplePaths)
  createHandler('getOnlyNewSampleFilePaths', database.getOnlyNewSampleFilePaths)
  createHandler('getCollectionAssets', database.getCollectionAssets)
  createHandler('getCollectionSampleCount', database.getCollectionSampleCount)
  // createHandler('getFolderAssetCount', database.getFolderAssetCount)
  createHandler('updateCollection', database.updateCollection)
  createHandler('verifyFoldersAndSamples', database.verifyFoldersAndSamples)
  createHandler('indexFolderSamples', database.indexFolderSamples)
  createHandler('addSampleToCollection', database.addSampleToCollection)
  createHandler('removeSampleFromCollection', database.removeSampleFromCollection)
}
