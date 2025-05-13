import { $collections } from '../setup'

export function removeFromCollection(collectionId: string, sampleId: string) {
  $collections.queryUpdate(collectionId, (collection) => {
    collection.sampleIds = collection.sampleIds.filter((id) => id !== sampleId)
  })
}
