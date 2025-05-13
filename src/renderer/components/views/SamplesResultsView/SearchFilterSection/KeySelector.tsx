import { createListCollection } from '#/components'
import { TONICS } from '#/constants/keys'
import { SelectInput } from '#/components/ui/SelectInput'
import { $search } from '#/stores/search.store'
import './KeySelector.css'

const tonicsCollection = createListCollection({
  items: TONICS
})

export const KeySelector = () => {
  const tonic = $search.filters.use((state) => state.tonic)
  const setTonic = (_, value: string) => $search.filters.set({ tonic: value })

  return (
    <SelectInput
      size="md"
      className="KeySelector"
      placeholder="Tonic"
      value={tonic}
      onChange={setTonic}
      collection={tonicsCollection}
      width="100%"
    />
  )
}
