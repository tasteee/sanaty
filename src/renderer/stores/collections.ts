import { datass } from 'datass'

// This holds all of the user's collections from the DB.
const $list = datass.array<CollectionT>([])

const reload = async () => {
  const allCollections = await window.electron.getAllCollections()
  $list.set(allCollections)
}

const createCollection = async (data: Partial<CollectionT>) => {
  const collection = await window.electron.createCollection(data)
  await reload()
  return collection
}

const deleteCollection = async (collectionId: string) => {
  await window.electron.deleteCollection(collectionId)
  await reload()
}

const updateCollection = async (id, updates: Partial<CollectionT>) => {
  await window.electron.updateCollection(id, updates)
  await reload()
}

const addSampleToCollection = async (collectionId: string, assetId: string) => {
  await window.electron.addSampleToCollection(collectionId, assetId)
  await reload()
}

const removeSampleFromCollection = async (collectionId: string, assetId: string) => {
  await window.electron.removeSampleFromCollection(collectionId, assetId)
  await reload()
}

export const $collections = {
  list: $list,
  updateCollection,
  reload,
  createCollection,
  deleteCollection,
  addSampleToCollection,
  removeSampleFromCollection
}

globalThis.$collections = $collections
