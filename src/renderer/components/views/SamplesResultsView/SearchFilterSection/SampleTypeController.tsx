import { createListCollection } from '#/components'
import { SAMPLE_TYPES } from '#/constants/sampleTypes'
import { SelectInput } from '#/components/ui/SelectInput'
import { $search } from '#/stores/search.store'

const sampleTypesCollection = createListCollection({
  items: SAMPLE_TYPES
})

export const SampleTypeController = () => {
  const sampleType = $search.filters.use((state) => state.sampleType)
  const setSampleType = (_, value: string) => $search.filters.set({ sampleType: value })

  return (
    <SelectInput placeholder="Sample Type" value={sampleType} onChange={setSampleType} collection={sampleTypesCollection} width="160px" />
  )
}
