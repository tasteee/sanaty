import { contextBridge, ipcRenderer } from 'electron'

const electronHandler = {
  openExplorerAtPath: (path: string) => ipcRenderer.invoke('openExplorerAtPath', path),
  addFolder: () => ipcRenderer.invoke('addFolder'),
  openExplorerAtFolder: (id) => ipcRenderer.invoke('openExplorerAtFolder', id),
  getSampleById: (id) => ipcRenderer.invoke('getSampleById', id),
  getAllFolders: () => ipcRenderer.invoke('getAllFolders'),
  refreshFolder: (id) => ipcRenderer.invoke('refreshFolder', id),
  removeFolder: (id) => ipcRenderer.invoke('removeFolder', id),
  getAllLikes: () => ipcRenderer.invoke('getAllLikes'),
  toggleLiked: (id) => ipcRenderer.invoke('toggleLiked', id),
  searchSamples: (filters) => ipcRenderer.invoke('searchSamples', filters),
  createCollection: (data) => ipcRenderer.invoke('createCollection', data),
  getAllCollections: () => ipcRenderer.invoke('getAllCollections'),
  editCollection: (collection) => ipcRenderer.invoke('editCollection', collection),
  deleteCollection: (id) => ipcRenderer.invoke('deleteCollection', id),
  addToCollection: (id, sampleId) => ipcRenderer.invoke('addToCollection', id, sampleId),
  removeFromCollection: (id, sampleId) => ipcRenderer.invoke('removeFromCollection', id, sampleId),
  getAudioData: (filePath) => ipcRenderer.invoke('getAudioData', filePath),
  startDrag: (filePath: string) => ipcRenderer.invoke('startDrag', filePath)
}

export type ElectronHandler = typeof electronHandler
contextBridge.exposeInMainWorld('electron', electronHandler)
