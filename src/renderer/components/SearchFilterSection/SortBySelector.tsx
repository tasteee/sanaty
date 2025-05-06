import { createListCollection } from '#/components'
import { $sort } from '#/stores/search.store'
import { SelectInput } from '#/components/ui/SelectInput'
import { SORT_BY_OPTIONS } from '#/constants/sortOptions'

const sortByCollection = createListCollection({
  items: SORT_BY_OPTIONS
})

export const SortBySelector = () => {
  const sortBy = $sort.by.use()

  return (
    <SelectInput
      placeholder="Sort By"
      value={sortBy.value}
      onChange={$sort.setSortByOption}
      collection={sortByCollection}
      width="180px"
    />
  )
}
