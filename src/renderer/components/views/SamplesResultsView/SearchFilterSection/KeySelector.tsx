import { createListCollection } from '#/components'
import { KEYS } from '#/constants/keys'
import { SelectInput } from '#/components/ui/SelectInput'
import { $search } from '#/stores/search.store'

const keysCollection = createListCollection({
  items: KEYS
})

export const KeySelector = () => {
  const key = $search.filters.use((state) => state.key)
  const setKey = (_, value: string) => $search.filters.set({ key: value })
  return <SelectInput placeholder="Key" value={key} onChange={setKey} collection={keysCollection} width="100px" />
}
