// src/main/handlers.ts
import { database } from './database'
import { ipcMain, clipboard, nativeImage, BrowserWindow, shell } from 'electron'
import fs from 'fs'
import path from 'path'

const image = nativeImage.createFromPath(path.join(__dirname, 'drag-icon.png'))

function createHandler(key, handle) {
  const handler = async (_, ...args) => handle(...args, _)
  return ipcMain.handle(key, handler)
}

function openExplorerAtPath(filePath: string) {
  shell.openPath(filePath)
}

export const setupIpcHandlers = (mainWindow) => {
  const startDrag = async (filePath, event) => {
    const file = path.resolve(filePath)

    if (!fs.existsSync(file)) {
      console.warn(`Drag failed — file does not exist: ${file}`)
      return false
    }

    if (filePath) {
      event.sender.startDrag({
        file,
        icon: image
      })

      console.log(`Drag started with file: ${file}`)
    } else {
      console.warn(`Drag failed — invalid window or file: ${file}`)
      return false
    }
  }

  createHandler('startDrag', startDrag)
  createHandler('openExplorerAtPath', openExplorerAtPath)
  createHandler('openExplorerAtFolder', database.openExplorerAtFolder)
  createHandler('addFolder', database.addFolder)
  createHandler('getAllFolders', database.getAllFolders)
  createHandler('refreshFolder', database.refreshFolder)
  createHandler('removeFolder', database.removeFolder)
  createHandler('getSampleById', database.getSampleById)
  createHandler('getAllLikes', database.getAllLikes)
  createHandler('toggleLiked', database.toggleLiked)
  createHandler('searchSamples', database.searchSamples)
  createHandler('createCollection', database.createCollection)
  createHandler('getAllCollections', database.getAllCollections)
  createHandler('editCollection', database.editCollection)
  createHandler('deleteCollection', database.deleteCollection)
  createHandler('addToCollection', database.addToCollection)
  createHandler('removeFromCollection', database.removeFromCollection)
  createHandler('getAudioData', database.getAudioData)
}
