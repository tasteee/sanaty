import { createListCollection } from '#/components'
import { SelectInput } from '#/components/ui/SelectInput'
import { SORT_BY_OPTIONS } from '#/constants/sortOptions'
import { $samplesViewStore } from '../samplesView.store'

const sortByCollection = createListCollection({
  items: SORT_BY_OPTIONS
})

export const SortBySelector = () => {
  const sortBy = $samplesViewStore.filters.use((state) => state.sortBy)
  const onChange = (_, value) => $samplesViewStore.filters.set({ sortBy: value })

  return <SelectInput placeholder="Sort By" value={sortBy} onChange={onChange} collection={sortByCollection} width="180px" />
}
