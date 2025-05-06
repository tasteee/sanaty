import { contextBridge, ipcRenderer } from 'electron'

const electronHandler = {
  // Folder management
  addFolder: () => ipcRenderer.invoke('addFolder'),
  removeFolder: (folderId: string) => ipcRenderer.invoke('removeFolder', folderId),

  // Asset management
  toggleAssetLiked: (assetId: string) => ipcRenderer.invoke('toggleAssetLiked', assetId),
  addTagToAsset: (assetId: string, tag: object) => ipcRenderer.invoke('addTagToAsset', assetId, tag),
  removeTagFromAsset: (assetId: string, tagId: string) => ipcRenderer.invoke('removeTagFromAsset', assetId, tagId),
  searchAssets: (filters: { name?: string; isLiked?: boolean; tagIds?: string[] }) =>
    ipcRenderer.invoke('searchAssets', filters),

  // Collection management
  createCollection: (name: string) => ipcRenderer.invoke('createCollection', name),
  deleteCollection: (collectionId: string) => ipcRenderer.invoke('deleteCollection', collectionId),
  updateCollectionName: (collectionId: string, newName: string) =>
    ipcRenderer.invoke('updateCollectionName', collectionId, newName),
  addAssetToCollection: (collectionId: string, assetId: string) =>
    ipcRenderer.invoke('addAssetToCollection', collectionId, assetId),
  removeAssetFromCollection: (collectionId: string, assetId: string) =>
    ipcRenderer.invoke('removeAssetFromCollection', collectionId, assetId),

  getAppData: () => ipcRenderer.invoke('getAppData')
}

contextBridge.exposeInMainWorld('electron', electronHandler)
export type ElectronHandler = typeof electronHandler
