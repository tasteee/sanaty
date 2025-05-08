// src/main/handlers.ts
import { ipcMain, dialog } from 'electron'
import { database } from './db'

export const setupIpcHandlers = () => {
  // const electronHandler = {
  //   addFolder: () => ipcRenderer.invoke('addFolder'),
  //   removeFolder: (id) => ipcRenderer.invoke('removeFolder', id),
  //   refreshFolder: (id) => ipcRenderer.invoke('refreshFolder', id),
  //   getAllFolders: () => ipcRenderer.invoke('getAllFolders'),
  //   getAllSamples: () => ipcRenderer.invoke('getAllSamples'),
  //   getAllCollections: () => ipcRenderer.invoke('getAllCollections'),
  //   addSampleToCollection: (id, sampleId) => ipcRenderer.invoke('addSampleToCollection', id, sampleId),
  //   removeSampleFromCollection: (id, sampleId) => ipcRenderer.invoke('removeSampleFromCollection', id, sampleId),

  //   updateSample: (id, updates: Partial<SampleT>) => ipcRenderer.invoke('updateSample', id, updates),
  //   updateCollection: (id, updates: Partial<SampleT>) => ipcRenderer.invoke('updateSample', id, updates),
  //   searchAssets: (filters: any) => ipcRenderer.invoke('searchAssets', filters),
  //   getCollectionAssets: (id: string) => ipcRenderer.invoke('getCollectionAssets', id),

  //   searchCollections: () => ipcRenderer.invoke('searchCollections'),
  //   createCollection: (data: Partial<CollectionT>) => {
  //     return ipcRenderer.invoke('createCollection', data)
  //   },

  //   deleteCollection: (collectionId: string) => {
  //     return ipcRenderer.invoke('deleteCollection', collectionId)
  //   },
  // }

  const handler = (key, handle) => {
    return ipcMain.handle(key, async (_, ...args) => handle(...args))
  }

  const addFolder = async (_) => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      title: 'Select a folder to index'
    })

    if (result.canceled || result.filePaths.length === 0) return null
    const folderPath = result.filePaths[0]
    const existingFolders = await database.getAllFolders()
    const alreadyAdded = existingFolders.some((f) => f.path === folderPath)
    if (alreadyAdded) return false
    return database.addFolder(folderPath)
  }

  handler('addFolder', addFolder)
  handler('getFolderSampleCount', database.getFolderSampleCount)
  handler('searchSamples', database.searchSamples)
  handler('removeFolder', database.removeFolder)
  handler('createFolder', database.createFolder)
  handler('refreshFolder', database.refreshFolder)
  handler('getAllFolders', database.getAllFolders)
  handler('getAllSamples', database.getAllSamples)
  handler('deleteCollection', database.deleteCollection)
  handler('getAllCollections', database.getAllCollections)
  handler('getFilePathsInFolder', database.getFilePathsInFolder)
  handler('createCollection', database.createCollection)
  handler('getAllFolderSamples', database.getAllFolderSamples)
  handler('getAllSamplePaths', database.getAllSamplePaths)
  handler('getOnlyNewSampleFilePaths', database.getOnlyNewSampleFilePaths)
  handler('getCollectionAssets', database.getCollectionAssets)
  handler('createSample', database.createSample)
  handler('indexFolderSamples', database.indexFolderSamples)
  handler('addSampleToCollection', database.addSampleToCollection)
  handler('removeSampleFromCollection', database.removeSampleFromCollection)
  handler('updateCollection', database.updateCollection)
  handler('updateSample', database.updateSample)

  // ipcMain.handle('getAppData', async () => {
  //   const folders = await database.folders.query({})
  //   const samples = await database.samples.query({})
  //   const collections = await database.collections.query()
  //   const tags = await database.tags.query()

  //   return {
  //     folders,
  //     samples,
  //     collections,
  //     tags
  //   }
  // })

  // const countFolderAssets = async (_, id: string) => {
  //   return database.folders.countFolderAssets(id)
  // }

  // ipcMain.handle('countFolderAssets', countFolderAssets)

  // const getFolderById = async (id: string) => {
  //   const folder = await database.folders.query({ _id: id })
  //   return folder[0] as FolderT
  // }

  // const getExistingAssetFilePaths = async () => {
  //   const existingAssets = await database.samples.query()
  //   const existingFilePaths = new Set(existingAssets.map((a) => a.filePath))
  //   return existingFilePaths
  // }

  // const getUniqueAssetsInsideFolder = async (folderPath: string, folderId: string) => {
  //   const indexedAssets = await indexFolder(folderPath, folderId)
  //   const existingFilePaths = await getExistingAssetFilePaths()
  //   const existingAssetFilter = (asset) => !existingFilePaths.has(asset.filePath)
  //   const filteredNewAssets = indexedAssets.filter(existingAssetFilter)
  //   return filteredNewAssets
  // }

  // // Add folder and index its contents
  // ipcMain.handle('addFolder', async () => {
  //   const result = await dialog.showOpenDialog({
  //     properties: ['openDirectory'],
  //     title: 'Select a folder to index'
  //   })

  //   if (result.canceled || result.filePaths.length === 0) return null
  //   const folderPath = result.filePaths[0]
  //   const existingFolders = await database.folders.query()
  //   const alreadyAdded = existingFolders.some((f) => f.path === folderPath)
  //   if (alreadyAdded) return { error: 'Folder already added' }
  //   const folderName = path.basename(folderPath)

  //   // Add folder to database
  //   const newFolder = await database.folders.add({
  //     name: folderName || 'Unnamed Folder',
  //     path: folderPath
  //   })

  //   const newAssets = await getUniqueAssetsInsideFolder(folderPath, newFolder._id)
  //   if (newAssets.length > 0) await database.samples.add(...newAssets)
  //   return database.folders.query()
  // })

  // const reIndexFolder = async (_, id: string) => {
  //   const folder = await getFolderById(id)
  //   const newAssets = await getUniqueAssetsInsideFolder(folder.path, folder._id)
  //   if (newAssets.length > 0) await database.samples.add(...newAssets)
  //   return database.folders.query()
  // }

  // const removeFolder = async (_event, folderId: string) => {
  //   // First get all samples in this folder
  //   const collections = await database.collections.query()
  //   const folderSamples = await database.samples.query({ folderId })
  //   const sampleIds = folderSamples.map((sample) => sample._id)

  //   for (const sampleId of sampleIds) {
  //     await database.samples.removeSample(sampleId)

  //     // For each collection that has this asset, remove the asset
  //     for (const collection of collections) {
  //       if (collection.sampleIds.includes(sampleId)) {
  //         await database.collections.update(collection._id, {
  //           sampleIds: collection.sampleIds.filter((id) => id !== sampleId)
  //         })
  //       }
  //     }
  //   }

  //   return await database.folders.remove(folderId)
  // }

  // ipcMain.handle('removeFolder', removeFolder)

  // ipcMain.handle('searchFolders', async () => {
  //   return database.folders.query()
  // })

  // ipcMain.handle('reIndexFolder', reIndexFolder)

  // // Collections
  // //
  // //

  // const getCollectionById = async (id: string) => {
  //   const collections = await database.collections.query({ _id: id })
  //   return collections[0] as CollectionT
  // }

  // const checkCollectionHasAssetId = async (collection: CollectionT, assetId: string) => {
  //   return collection.sampleIds.includes(assetId)
  // }

  // const createCollection = async (_event, data: Partial<CollectionT>) => {
  //   return await database.collections.add(data)
  // }

  // const deleteCollection = async (_event, collectionId: string) => {
  //   return await database.collections.remove(collectionId)
  // }

  // const updateCollection = async (_event, collection: Partial<CollectionT>) => {
  //   const { _id: id, ...updates } = collection
  //   return await database.collections.update(id, updates)
  // }

  // const addAssetToCollection = async (_, collectionId: string, assetId: string) => {
  //   const collection = await getCollectionById(collectionId)
  //   const isAssetInCollection = checkCollectionHasAssetId(collection, assetId)
  //   if (isAssetInCollection) return true

  //   return await database.collections.update(collectionId, {
  //     sampleIds: [...collection.sampleIds, assetId]
  //   })
  // }

  // const removeAssetFromCollection = async (_, collectionId: string, assetId: string) => {
  //   const collection = await getCollectionById(collectionId)
  //   const newsampleIds = collection.sampleIds.filter((id) => id !== assetId)

  //   return await database.collections.update(collectionId, {
  //     sampleIds: newsampleIds
  //   })
  // }

  // ipcMain.handle('searchCollections', async () => {
  //   return database.collections.query()
  // })

  // ipcMain.handle('createCollection', createCollection)
  // ipcMain.handle('deleteCollection', deleteCollection)
  // ipcMain.handle('updateCollection', updateCollection)
  // ipcMain.handle('addAssetToCollection', addAssetToCollection)
  // ipcMain.handle('removeAssetFromCollection', removeAssetFromCollection)

  // const getCollectionAssets = async (_, collectionId: string) => {
  //   return searchAssets(null, { collectionId })
  // }

  // const searchAssets = async (_event, filters: Partial<AssetSearchQueryT>) => {
  //   const searchQuery = {
  //     text: filters.text || '',
  //     isLiked: filters.isLiked || false,
  //     tags: filters.tags || [],
  //     collectionId: filters.collectionId || '',
  //     bpmRange: filters.bpmRange || [0, 300],
  //     durationRange: filters.durationRange || [0, 600],
  //     key: filters.key || '',
  //     scale: filters.scale || '',
  //     sampleType: filters.sampleType || '',
  //     sortBy: filters.sortBy || 'name',
  //     sortOrder: filters.sortOrder || 'ascending'
  //   } as AssetSearchQueryT

  //   const results = await database.samples.query(searchQuery)
  //   const { sortBy, sortOrder } = searchQuery

  //   const sortedResults = results.sort((a: SampleT, b: SampleT) => {
  //     let compareValue = 0

  //     switch (sortBy) {
  //       case 'date':
  //         compareValue = a.createdDate - b.createdDate
  //         break
  //       case 'length':
  //         compareValue = a.duration - b.duration
  //         break
  //       case 'name':
  //         compareValue = a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
  //         break
  //       case 'random':
  //         compareValue = Math.random() - 0.5
  //         break
  //       default:
  //         compareValue = 0
  //     }

  //     // If descending, invert the comparison
  //     return sortOrder === 'descending' ? -compareValue : compareValue
  //   })

  //   return sortedResults
  // }

  // const updateAsset = async (_event, data: Partial<SampleT>) => {
  //   const { _id: id, ...updates } = data
  //   return await database.samples.update(id, updates)
  // }

  // const getLatestSamples = async (_) => {
  //   const allSamples = await database.samples.query()
  //   return allSamples.slice(0, 50)
  // }

  // ipcMain.handle('getCollectionAssets', getCollectionAssets)
  // ipcMain.handle('updateAsset', updateAsset)
  // ipcMain.handle('searchAssets', searchAssets)
  // ipcMain.handle('getLatestSamples', getLatestSamples)
}
