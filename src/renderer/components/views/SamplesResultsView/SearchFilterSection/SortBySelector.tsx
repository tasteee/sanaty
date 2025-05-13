import { createListCollection } from '#/components'
import { SelectInput } from '#/components/ui/SelectInput'
import { SORT_BY_OPTIONS } from '#/constants/sortOptions'
import { $search } from '#/stores/search.store'
import './SortBySelector.css'

const sortByCollection = createListCollection({
  items: SORT_BY_OPTIONS
})

export const SortBySelector = () => {
  const sortBy = $search.useSortByFilter()
  const onChange = (_, value) => $search.setSortBy(value)

  return (
    <SelectInput
      className="SortBySelector"
      placeholder="Sort By"
      value={sortBy}
      onChange={onChange}
      collection={sortByCollection}
      width="180px"
    />
  )
}
