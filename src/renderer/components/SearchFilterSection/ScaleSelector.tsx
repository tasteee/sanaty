import { createListCollection } from '#/components'
import { SelectInput } from '#/components/ui/SelectInput'
import { SCALES } from '#/constants/scales'
import { $search } from '#/stores/search.store'
import './ScaleSelector.css'

const scalesCollection = createListCollection({
  items: SCALES
})

export const ScaleSelector = () => {
  const scale = $search.filters.use((state) => state.scale)
  const setScale = (_, value: string) => $search.filters.set({ scale: value })
  return (
    <SelectInput
      size="md"
      className="ScaleSelector"
      placeholder="Scale"
      value={scale}
      onChange={setScale}
      collection={scalesCollection}
      width="100%"
    />
  )
}
