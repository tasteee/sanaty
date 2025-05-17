import { Select } from '@mantine/core'
import { $search } from '#/stores/search.store'
import './SortBySelector.css'

export const SortBySelector = () => {
  const sortBy = $search.useSortByFilter()
  const onChange = (value) => $search.setSortBy(value)

  return (
    <Select
      size="xs"
      className="SortBySelector"
      placeholder="Sort By"
      value={sortBy}
      onChange={onChange}
      width="180px"
      data={['Name', 'Date Added', 'Duration']}
    />
  )
}
