import { createListCollection } from '#/components'
import { $filters } from '#/stores/search.store'
import { SelectInput } from '#/components/ui/SelectInput'
import { SCALES } from '#/constants/scales'

const scalesCollection = createListCollection({
  items: SCALES
})

export const ScaleSelector = () => {
  const scale = $filters.scale.use()
  return (
    <SelectInput
      placeholder="Scale"
      value={scale.value}
      onChange={$filters.setScale}
      collection={scalesCollection}
      width="160px"
    />
  )
}
