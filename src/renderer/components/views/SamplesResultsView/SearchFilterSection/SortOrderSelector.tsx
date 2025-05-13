import { createListCollection } from '#/components'
import { SelectInput } from '#/components/ui/SelectInput'
import { SORT_ORDER_OPTIONS } from '#/constants/sortOptions'
import { $search } from '#/stores/search.store'
import './SortOrderSelector.css'

const sortOrderCollection = createListCollection({
  items: SORT_ORDER_OPTIONS
})

export const SortOrderSelector = () => {
  const sortOrder = $search.filters.use((state) => state.sortOrder)
  const onChange = (_, value) => $search.filters.set({ sortOrder: value })

  return (
    <SelectInput
      className="SortOrderSelector"
      placeholder="Sort Order"
      value={sortOrder}
      onChange={onChange}
      collection={sortOrderCollection}
      width="180px"
    />
  )
}
