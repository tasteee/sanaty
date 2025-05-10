import { createListCollection } from '#/components'
import { KEYS } from '#/constants/keys'
import { SelectInput } from '#/components/ui/SelectInput'
import { $samplesViewStore } from '../samplesView.store'

const keysCollection = createListCollection({
  items: KEYS
})

export const KeySelector = () => {
  const key = $samplesViewStore.filters.use((state) => state.key)
  const setKey = (_, value: string) => $samplesViewStore.filters.set({ key: value })
  return <SelectInput placeholder="Key" value={key} onChange={setKey} collection={keysCollection} width="100px" />
}
