import { Select } from '@mantine/core'
import { $search } from '#/stores/search.store'
import './ItemsPerPageSelector.css'

export const ItemsPerPageSelector = () => {
  const itemsPerPage = $search.usePaginationItemsPerPage()
  const onChange = (value) => $search.setItemsPerPage(value)

  return (
    <Select
      size="xs"
      width="120px"
      value={itemsPerPage}
      onChange={onChange}
      className="ItemsPerPageSelector"
      placeholder="Items Per Page"
      data={['10', '20', '50']}
    />
  )
}
