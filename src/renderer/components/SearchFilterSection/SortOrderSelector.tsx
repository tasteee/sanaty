import { Select } from '@mantine/core'
import { $search } from '#/stores/search.store'
import './SortOrderSelector.css'

export const SortOrderSelector = () => {
  const sortOrder = $search.useSortOrderFilter()
  const onChange = (value) => $search.setSortOrder(value)

  return (
    <Select
      size="xs"
      width="160px"
      value={sortOrder}
      onChange={onChange}
      className="SortOrderSelector"
      placeholder="Sort Order"
      data={['Ascending', 'Descending']}
    />
  )
}
