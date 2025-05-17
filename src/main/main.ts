import { app, BrowserWindow, ipcMain, shell, dialog } from 'electron'
import path from 'path'
import fs from 'fs'
import log from 'electron-log'
import { autoUpdater } from 'electron-updater'
import MenuBuilder from './menu'
import { resolveHtmlPath } from './util'
import { setupIpcHandlers } from './handlers'
import { initDatabase } from './database'

// const iconBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgS8btkIAAAAASUVORK5CYII='
// const iconPath = path.join(__dirname, '../img', 'drag-icon.png')
// fs.writeFileSync(iconPath, Buffer.from(iconBase64, 'base64'))

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
  await initDatabase()

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

  setupIpcHandlers(mainWindow)
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
