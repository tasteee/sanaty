import { createListCollection } from '#/components'
import { $sort } from '#/stores/search.store'
import { SelectInput } from '#/components/ui/SelectInput'
import { SORT_ORDER_OPTIONS } from '#/constants/sortOptions'

const sortOrderCollection = createListCollection({
  items: SORT_ORDER_OPTIONS
})

export const SortOrderSelector = () => {
  const sortOrder = $sort.order.use()

  return (
    <SelectInput
      placeholder="Sort Order"
      value={sortOrder.value}
      onChange={$sort.setSortOrderOption}
      collection={sortOrderCollection}
      width="180px"
    />
  )
}
