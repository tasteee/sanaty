import { contextBridge, ipcRenderer } from 'electron'

// Define all API handlers for the renderer
const electronHandler = {
  openExplorerAtPath: (path: string) => ipcRenderer.invoke('openExplorerAtPath', path),

  getAllLikes: () => ipcRenderer.invoke('getAllLikes'),

  addFolder: () => ipcRenderer.invoke('addFolder'),
  removeFolder: (id) => ipcRenderer.invoke('removeFolder', id),
  refreshFolder: (id) => ipcRenderer.invoke('refreshFolder', id),
  getAllFolders: () => ipcRenderer.invoke('getAllFolders'),
  getFolderSampleCount: (id) => ipcRenderer.invoke('getFolderSampleCount', id),

  getAllSamples: () => ipcRenderer.invoke('getAllSamples'),
  updateSample: (id, updates: Partial<SampleT>) => ipcRenderer.invoke('updateSample', id, updates),
  searchSamples: (filters: any) => ipcRenderer.invoke('searchSamples', filters),

  createCollection: (data: Partial<CollectionT>) => ipcRenderer.invoke('createCollection', data),
  updateCollection: (id, updates: Partial<SampleT>) => ipcRenderer.invoke('updateCollection', id, updates),
  deleteCollection: (collectionId: string) => ipcRenderer.invoke('deleteCollection', collectionId),
  getAllCollections: () => ipcRenderer.invoke('getAllCollections'),
  getCollectionSampleCount: (id: string) => ipcRenderer.invoke('getCollectionSampleCount', id),
  addSampleToCollection: (id, sampleId) => ipcRenderer.invoke('addSampleToCollection', id, sampleId),
  removeSampleFromCollection: (id, sampleId) => ipcRenderer.invoke('removeSampleFromCollection', id, sampleId),

  toggleAssetLiked: (id: string) => ipcRenderer.invoke('toggleAssetLiked', id),

  verifyFoldersAndSamples: () => ipcRenderer.invoke('verifyFoldersAndSamples')
}

// Expose the API to the renderer process
contextBridge.exposeInMainWorld('electron', electronHandler)

// Export the type for TypeScript usage in the renderer
export type ElectronHandler = typeof electronHandler
