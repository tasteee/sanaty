import { $samples, $collections, $folders } from '../setup'

export function removeFolder(id: string) {
  const samples = $samples.query({ folderId: id })
  const sampleIds = samples.map((sample) => sample.id)

  const updatedCollections = $collections.state.map((collection) => {
    const newSampleIds = collection.sampleIds.filter((id) => !sampleIds.includes(id))
    return { ...collection, sampleIds: newSampleIds }
  })

  $collections.state = updatedCollections
  $samples.queryRemove({ folderId: id })
  $folders.queryRemove(id)
}
