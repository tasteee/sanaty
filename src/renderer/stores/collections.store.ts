import { makeGlobal } from '#/modules/_global'
import { datass } from 'datass'
import { toaster } from '#/components/ui/toaster'

class CollectionsStore {
  store = datass.array<CollectionT>([])

  load = async () => {
    const allCollections = await window.electron.getAllCollections()
    this.store.set(allCollections)
  }

  create = async (data: Partial<CollectionT>) => {
    const collection = await window.electron.createCollection(data)
    await this.load()
    return collection
  }

  delete = async (id) => {
    await window.electron.deleteCollection(id)
    await this.load()
  }

  update = async (id, updates) => {
    const { result, error } = await window.electron.updateCollection(id, updates)
    if (error) console.error('updateCollection error', error)
    if (error) return error
    console.log('updateCollection success', result)
    await this.load()
    return result
  }

  addSampleToCollection = async (id, sampleId) => {
    const success = await window.electron.addToCollection(id, sampleId)
    await this.load()
    if (!success) return

    toaster.create({
      title: `Added to collection.`,
      type: 'success',
      duration: 2000
    })
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
makeGlobal('collections', $collections)
