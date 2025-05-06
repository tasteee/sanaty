import { $filters } from '#/stores/search.store'
import { createListCollection } from '#/components'
import { SAMPLE_TYPES } from '#/constants/sampleTypes'
import { SelectInput } from '#/components/ui/SelectInput'

const sampleTypesCollection = createListCollection({
  items: SAMPLE_TYPES
})

export const SampleTypeController = () => {
  const sampleType = $filters.sampleType.use()

  return (
    <SelectInput
      placeholder="Sample Type"
      value={sampleType.value}
      onChange={$filters.setSampleType}
      collection={sampleTypesCollection}
      width="160px"
    />
  )
}
