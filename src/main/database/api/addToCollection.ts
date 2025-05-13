import { $collections } from '../setup'

export function addToCollection(collectionId: string, sampleId: string) {
  $collections.queryUpdate(collectionId, (collection) => {
    collection.sampleIds = [...collection.sampleIds, sampleId]
  })
}
