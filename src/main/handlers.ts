// src/main/handlers.ts
import { database } from './database'
import { ipcMain, clipboard, nativeImage, BrowserWindow, shell } from 'electron'
import fs from 'fs'
import path from 'path'
import os from 'os'
import plist from 'plist' // macOS-specific

const image = nativeImage.createFromPath(path.join(__dirname, 'drag-icon.png'))

const copySampleToClipboard = (filePath: string): boolean => {
  try {
    if (!fs.existsSync(filePath)) {
      console.error(`File does not exist: ${filePath}`)
      return false
    }

    const fileName = path.basename(filePath)

    if (process.platform === 'darwin') {
      // macOS: Use NSFilenamesPboardType
      const data = plist.build([filePath])
      clipboard.writeBuffer('NSFilenamesPboardType', Buffer.from(data, 'utf8'))
      console.log(`Copied file to clipboard (macOS-style): ${filePath}`)
    } else if (process.platform === 'win32') {
      // Windows: CF_HDROP format
      const dropFiles = createCF_HDROPBuffer([filePath])
      clipboard.writeBuffer('DropEffect', Buffer.from('copy')) // Optional, tells Windows it's a copy
      clipboard.writeBuffer('FileNameW', dropFiles)
      console.log(`Copied file to clipboard (Windows-style): ${filePath}`)
    } else {
      console.warn('Clipboard copy for files not supported on this OS')
      return false
    }

    return true
  } catch (error) {
    console.error('Failed to copy file to clipboard:', error)
    return false
  }
}

function createCF_HDROPBuffer(filePaths: string[]): Buffer {
  const files = filePaths.join('\0') + '\0\0' // double null-terminated
  return Buffer.from(files, 'utf16le')
}

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
        file, // i.e  'C:\\Users\\hrx\\Desktop\\music\\demos\\stay.mp3'
        icon: image
      })

      console.log(`Drag started with file: ${file}`)
    } else {
      console.warn(`Drag failed — invalid window or file: ${file}`)
      return false
    }
  }

  createHandler('startDrag', startDrag)
  createHandler('copySampleToClipboard', copySampleToClipboard)
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
  createHandler('updateCollection', database.updateCollection)
  createHandler('deleteCollection', database.deleteCollection)
  createHandler('addToCollection', database.addToCollection)
  createHandler('removeFromCollection', database.removeFromCollection)
  createHandler('getAudioData', database.getAudioData)
}
