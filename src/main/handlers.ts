// src/main/handlers.ts
import { ipcMain, shell } from 'electron'
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
  createHandler('getAllFolders', database.getAllFolders)
  createHandler('refreshFolder', database.refreshFolder)
  createHandler('removeFolder', database.removeFolder)
  createHandler('getAllLikes', database.getAllLikes)
  createHandler('toggleLiked', database.toggleLiked)
  createHandler('searchSamples', database.searchSamples)
  createHandler('createCollection', database.createCollection)
  createHandler('getAllCollections', database.getAllCollections)
  createHandler('updateCollection', database.updateCollection)
  createHandler('deleteCollection', database.deleteCollection)
  createHandler('addToCollection', database.addToCollection)
  createHandler('removeFromCollection', database.removeFromCollection)
}
