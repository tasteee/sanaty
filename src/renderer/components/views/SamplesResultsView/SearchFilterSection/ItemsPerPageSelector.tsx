import { createListCollection } from '#/components'
import { SelectInput } from '#/components/ui/SelectInput'
import { $search } from '#/stores/search.store'
import './ItemsPerPageSelector.css'

const ITEMS_PER_PAGE_OPTIONS = [
  { label: '10', value: '10' },
  { label: '20', value: '20' },
  { label: '50', value: '50' },
  { label: '100', value: '100' }
]

const itemsPerPageCollection = createListCollection({
  items: ITEMS_PER_PAGE_OPTIONS
})

export const ItemsPerPageSelector = () => {
  const itemsPerPage = $search.pagination.use((state) => state.itemsPerPage)
  const onChange = (_, value) => $search.setItemsPerPage(value)

  return (
    <SelectInput
      width="180px"
      size="sm"
      className="ItemsPerPageSelector"
      placeholder="Items Per Page"
      value={itemsPerPage + ''}
      onChange={onChange}
      collection={itemsPerPageCollection}
      masker={(item) => `Per page: ${item.label}`}
    />
  )
}
