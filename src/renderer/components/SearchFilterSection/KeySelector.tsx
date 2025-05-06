import { createListCollection } from '#/components'
import { $filters } from '#/stores/search.store'
import { KEYS } from '#/constants/keys'
import { SelectInput } from '#/components/ui/SelectInput'

const keysCollection = createListCollection({
  items: KEYS
})

export const KeySelector = () => {
  const key = $filters.key.use()
  return (
    <SelectInput placeholder="Key" value={key.value} onChange={$filters.setKey} collection={keysCollection} width="100px" />
  )
}
