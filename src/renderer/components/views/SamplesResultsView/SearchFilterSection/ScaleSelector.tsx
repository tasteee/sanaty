import { createListCollection } from '#/components'
import { SelectInput } from '#/components/ui/SelectInput'
import { SCALES } from '#/constants/scales'
import { $search } from '#/stores/search.store'

const scalesCollection = createListCollection({
  items: SCALES
})

export const ScaleSelector = () => {
  const scale = $search.filters.use((state) => state.scale)
  const setScale = (_, value: string) => $search.filters.set({ scale: value })
  return <SelectInput placeholder="Scale" value={scale} onChange={setScale} collection={scalesCollection} width="160px" />
}
