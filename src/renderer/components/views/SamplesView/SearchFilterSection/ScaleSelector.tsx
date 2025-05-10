import { createListCollection } from '#/components'
import { SelectInput } from '#/components/ui/SelectInput'
import { SCALES } from '#/constants/scales'
import { $samplesViewStore } from '../samplesView.store'

const scalesCollection = createListCollection({
  items: SCALES
})

export const ScaleSelector = () => {
  const scale = $samplesViewStore.filters.use((state) => state.scale)
  const setScale = (_, value: string) => $samplesViewStore.filters.set({ scale: value })
  console.log({ scale })
  return <SelectInput placeholder="Scale" value={scale} onChange={setScale} collection={scalesCollection} width="160px" />
}
