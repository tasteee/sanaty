import { datass } from 'datass'
import { toaster } from '#/components/toaster'
import { $ui } from './ui.store'
import { $toasts } from './toasts.store'

class CollectionsStore {
  store = datass.array<CollectionT>([])

  load = async () => {
    const allCollections = await window.electron.getAllCollections()
    console.log({ allCollections })
    this.store.set(allCollections)
  }

  create = async (data) => {
    const response = await window.electron.createCollection(data)

    if (response.didFail) {
      console.error('$collections.create failed:', response)
      $toasts.open('createCollectionFail')
      return response
    }

    $toasts.open('createCollectionPass')
    await this.load()
    return response
  }

  edit = async (collection) => {
    const response = await window.electron.editCollection(collection)

    if (response.didFail) {
      console.error('$collections.edit failed:', response)
      $toasts.open('editCollectionFail')
      return response
    }

    await this.load()
    return response
  }

  delete = async (id) => {
    await window.electron.deleteCollection(id)
    await this.load()
  }

  addSampleToCollection = async (collectionId, sampleId) => {
    const response = await window.electron.addToCollection(collectionId, sampleId)
    await this.load()
  }

  removeSampleFromCollection = async (id, sampleId) => {
    await window.electron.removeFromCollection(id, sampleId)
    await this.load()
  }

  useCollection = (id) => {
    const allCollections = this.store.use()
    return allCollections.find((collection) => collection.id === id)
  }
}

export const $collections = new CollectionsStore()
globalThis.$collections = $collections
