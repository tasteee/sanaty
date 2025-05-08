import { contextBridge, ipcRenderer } from 'electron'

// Define all API handlers for the renderer
const electronHandler = {
  addFolder: () => ipcRenderer.invoke('addFolder'),
  removeFolder: (id) => ipcRenderer.invoke('removeFolder', id),
  refreshFolder: (id) => ipcRenderer.invoke('refreshFolder', id),
  getAllFolders: () => ipcRenderer.invoke('getAllFolders'),
  getAllSamples: () => ipcRenderer.invoke('getAllSamples'),
  getAllCollections: () => ipcRenderer.invoke('getAllCollections'),
  addSampleToCollection: (id, sampleId) => ipcRenderer.invoke('addSampleToCollection', id, sampleId),
  removeSampleFromCollection: (id, sampleId) => ipcRenderer.invoke('removeSampleFromCollection', id, sampleId),
  getFolderSampleCount: (id) => ipcRenderer.invoke('getFolderSampleCount', id),
  updateSample: (id, updates: Partial<SampleT>) => ipcRenderer.invoke('updateSample', id, updates),
  updateCollection: (id, updates: Partial<SampleT>) => ipcRenderer.invoke('updateSample', id, updates),
  searchAssets: (filters: any) => ipcRenderer.invoke('searchAssets', filters),
  getCollectionAssets: (id: string) => ipcRenderer.invoke('getCollectionAssets', id),

  searchCollections: () => ipcRenderer.invoke('searchCollections'),
  createCollection: (data: Partial<CollectionT>) => {
    return ipcRenderer.invoke('createCollection', data)
  },

  deleteCollection: (collectionId: string) => {
    return ipcRenderer.invoke('deleteCollection', collectionId)
  }
}

// Expose the API to the renderer process
contextBridge.exposeInMainWorld('electron', electronHandler)

// Export the type for TypeScript usage in the renderer
export type ElectronHandler = typeof electronHandler
