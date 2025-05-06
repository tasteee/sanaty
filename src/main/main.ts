import { app, BrowserWindow, ipcMain, shell, dialog } from 'electron'
import path from 'path'
import fs from 'fs'
import log from 'electron-log'
import { autoUpdater } from 'electron-updater'
import { v4 as uuidv4 } from 'uuid'
import { config } from './config'
import { indexFolder } from './indexer'
import { CONFIG_FILENAME, DEFAULT_CONFIG } from './constants'
import MenuBuilder from './menu'
import { resolveHtmlPath } from './util'

// App state
let mainWindow: BrowserWindow | null = null

// Auto updater
class AppUpdater {
  constructor() {
    log.transports.file.level = 'info'
    autoUpdater.logger = log
    autoUpdater.checkForUpdatesAndNotify()
  }
}

// Get assets from resources path
const getAssetPath = (...paths: string[]): string => {
  const resourceAssetsPath = path.join(process.resourcesPath, 'assets')
  const cwdAssetsPath = path.join(__dirname, '../../assets')
  const assetsPath = app.isPackaged ? resourceAssetsPath : cwdAssetsPath
  return path.join(assetsPath, ...paths)
}

// Create main browser window
const createWindow = async () => {
  const nearPreloadPath = path.join(__dirname, 'preload.js')
  const erbPreloadPath = path.join(__dirname, '../../.erb/dll/preload.js')
  const preload = app.isPackaged ? nearPreloadPath : erbPreloadPath

  mainWindow = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    transparent: false,
    resizable: true,
    alwaysOnTop: false,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      webSecurity: false,
      sandbox: false,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      allowRunningInsecureContent: true,
      contextIsolation: true,
      devTools: true,
      preload
    }
  })

  mainWindow.loadURL(resolveHtmlPath('index.html'))
  if (!app.isPackaged) mainWindow.webContents.openDevTools()
  mainWindow.maximize()

  mainWindow.on('ready-to-show', () => mainWindow?.show())
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  const menuBuilder = new MenuBuilder(mainWindow)
  menuBuilder.buildMenu()

  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url)
    return { action: 'deny' }
  })

  new AppUpdater()
}

// App lifecycle
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (!mainWindow) createWindow()
  })
})

// === IPC HANDLERS ===

// Quit
ipcMain.handle('closeApp', () => app.quit())

ipcMain.handle('getAppData', () => {
  return config.get()
})

ipcMain.handle('addFolder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
    title: 'Select a folder to index'
  })

  if (result.canceled || result.filePaths.length === 0) {
    return null
  }

  const folderPath = result.filePaths[0]
  const existingFolders = config.get('folders') || []

  // 🛑 Check for duplicate folder
  const alreadyAdded = existingFolders.some((f) => f.path === folderPath)
  if (alreadyAdded) {
    return { error: 'Folder already added' }
  }

  const folderId = uuidv4()
  const folderData = { id: folderId, path: folderPath }

  const existingAssets = config.get('assets') || []
  const existingFilePaths = new Set(existingAssets.map((a) => a.filePath))

  // ✅ Only index new files
  const indexedAssets = await indexFolder(null, folderPath)
  const newAssets = indexedAssets
    .filter((asset) => !existingFilePaths.has(asset.filePath))
    .map((asset) => ({
      ...asset,
      id: uuidv4(),
      folderId,
      isLiked: false,
      tags: [],
      dateAdded: Date.now(),
      sampleType: 'loop', // Placeholder
      key: 'C', // Placeholder
      scale: 'Major', // Placeholder
      bpm: 120 // Placeholder
    }))

  config.set('folders', [...existingFolders, folderData])
  config.set('assets', [...existingAssets, ...newAssets])
  config.save()

  return config.get('assets')
})

// Remove folder and its assets
ipcMain.handle('removeFolder', async (_event, folderId: string) => {
  const folders = (config.get('folders') || []).filter((f) => f.id !== folderId)
  const assets = (config.get('assets') || []).filter((a) => a.folderId !== folderId)

  config.set('folders', folders)
  config.set('assets', assets)
  config.save()

  return true
})

const getAssetById = (id) => {
  const assets = config.get('assets')
  return assets.find((asset) => asset.id === id)
}

// Like/unlike asset
ipcMain.handle('toggleAssetLiked', (_event, assetId: string) => {
  const assets = config.get('assets') || []

  const newAssets = assets.map((asset) => {
    if (asset.id !== assetId) return asset
    console.log('FOUND IT, current: ', asset.isLiked)
    return { ...asset, isLiked: !asset.isLiked }
  })

  config.set('assets', newAssets)
  config.save()

  const newAsset = getAssetById(assetId)
  return newAsset
})

// Create collection
ipcMain.handle('createCollection', (_event, name: string) => {
  const collections = config.get('collections') || []
  collections.push({
    id: uuidv4(),
    name,
    assetIds: [],
    createdDate: Date.now()
  })
  config.set('collections', collections)
  config.save()
  return true
})

// Delete collection
ipcMain.handle('deleteCollection', (_event, collectionId: string) => {
  const collections = (config.get('collections') || []).filter((c) => c.id !== collectionId)
  config.set('collections', collections)
  config.save()
  return true
})

// Update collection name
ipcMain.handle('updateCollectionName', (_event, collectionId: string, newName: string) => {
  const collections = config.get('collections') || []
  const updated = collections.map((c) => (c.id === collectionId ? { ...c, name: newName } : c))
  config.set('collections', updated)
  config.save()
  return true
})

// Add asset to collection
ipcMain.handle('addAssetToCollection', (_event, collectionId: string, assetId: string) => {
  const collections = config.get('collections') || []
  const updated = collections.map((c) =>
    c.id === collectionId && !c.assetIds.includes(assetId) ? { ...c, assetIds: [...c.assetIds, assetId] } : c
  )
  config.set('collections', updated)
  config.save()
  return true
})

// Remove asset from collection
ipcMain.handle('removeAssetFromCollection', (_event, collectionId: string, assetId: string) => {
  const collections = config.get('collections') || []
  const updated = collections.map((c) =>
    c.id === collectionId ? { ...c, assetIds: c.assetIds.filter((id) => id !== assetId) } : c
  )
  config.set('collections', updated)
  config.save()
  return true
})

// Add tag to asset
ipcMain.handle('addTagToAsset', (_event, assetId: string, tag: any) => {
  const assets = config.get('assets') || []
  const updated = assets.map((a) => (a.id === assetId ? { ...a, tags: [...(a.tags || []), tag] } : a))
  config.set('assets', updated)
  config.save()
  return true
})

// Remove tag from asset
ipcMain.handle('removeTagFromAsset', (_event, assetId: string, tagId: string) => {
  const assets = config.get('assets') || []
  const updated = assets.map((a) => (a.id === assetId ? { ...a, tags: a.tags.filter((t) => t.id !== tagId) } : a))
  config.set('assets', updated)
  config.save()
  return true
})

// Search assets
ipcMain.handle('searchAssets', (_event, filters: { name?: string; isLiked?: boolean; tagIds?: string[] }) => {
  const allAssets = config.get('assets') || []

  const results = allAssets.filter((asset) => {
    const matchName = filters.name ? asset.name.toLowerCase().includes(filters.name.toLowerCase()) : true
    const matchLiked = filters.isLiked !== undefined ? asset.isLiked === filters.isLiked : true
    const matchTags =
      filters.tagIds && filters.tagIds.length > 0
        ? filters.tagIds.every((tagId) => asset.tags?.some((tag: any) => tag.id === tagId))
        : true

    return matchName && matchLiked && matchTags
  })

  return results
})
