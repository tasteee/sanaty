import { datass } from 'datass'

// All the samples currently loaded based on the current view / filters.
// This is NOT all samples in the database.

const $list = datass.array<SampleT>([])
const $activeSample = datass.object(null)

const useSample = (id) => {
  console.log('useSample', { id })
  return $list.use((samples) => samples.find((sample) => sample._id === id))
}

const updateSamples = (newSamples: SampleT[]) => {
  console.log('updateSamples', { newSamplesCount: newSamples.length })
  $list.set(newSamples)
}

const updateSample = async (id, updates: Partial<SampleT>) => {
  const newSample = await window.electron.updateSample(id, updates)

  const newSamples = $list.state.map((sample: SampleT) => {
    if (sample._id !== newSample._id) return sample
    return newSample
  })

  $list.set(newSamples)
}

const toggleSampleLiked = async (id: string) => {}

const searchSamples = async (filters: any) => {
  console.log('searchSamples', { filters })
  const results = await window.electron.searchAssets(filters)
  $samples.updateSamples(results)
}

const loadCollectionSamples = async (id: string) => {
  console.log('loadCollectionSamples', { id })
  const assets = await window.electron.getCollectionAssets(id)
  $list.set(assets)
}

const getSomeSamples = async () => {
  const assets: SampleT[] = await window.electron.getAllSamples()
  const first50 = assets.slice(0, 50)
  $list.set(first50)
}

export const $samples = {
  list: $list,
  activeSample: $activeSample,
  useSample,
  updateSamples,
  updateSample,
  toggleSampleLiked,
  searchSamples,
  loadCollectionSamples,
  getSomeSamples
}
