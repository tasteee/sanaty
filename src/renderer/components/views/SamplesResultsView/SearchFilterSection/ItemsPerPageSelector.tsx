import { createListCollection } from '#/components'
import { SelectInput } from '#/components/ui/SelectInput'
import { $pagination } from '../samplesView.store'

const ITEMS_PER_PAGE_OPTIONS = [
  { label: '10', value: '10' },
  { label: '20', value: '20' },
  { label: '50', value: '50' },
  { label: '100', value: '100' }
]

const itemsPerPageCollection = createListCollection({
  items: ITEMS_PER_PAGE_OPTIONS
})

const masker = (item) => `Per page: ${item.label}`

export const ItemsPerPageSelector = () => {
  const itemsPerPage = $pagination.itemsPerPage.use()
  // const option = $pagination.itemsPerPageOption.use()
  const onChange = (_, value) => $pagination.setItemsPerPage(value)

  return (
    <SelectInput
      placeholder="Items Per Page"
      value={itemsPerPage + ''}
      onChange={onChange}
      collection={itemsPerPageCollection}
      width="180px"
      masker={masker}
    />
  )
}
