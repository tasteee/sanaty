export const SORT_BY_OPTIONS = [
  { label: 'Date Added', value: 'dateAdded' },
  { label: 'Length', value: 'duration' },
  { label: 'Name', value: 'name' }
]

export const SORT_ORDER_OPTIONS = [
  { label: 'Descending', value: 'descending' },
  { label: 'Ascending', value: 'ascending' }
]

export const ITEMS_PER_PAGE_OPTIONS = [
  { label: '10', value: '10' },
  { label: '20', value: '20' },
  { label: '50', value: '50' },
  { label: '100', value: '100' }
]

export const ITEMS_PER_PAGE_OPTIONS_MAP = {
  10: ITEMS_PER_PAGE_OPTIONS[0],
  20: ITEMS_PER_PAGE_OPTIONS[1],
  50: ITEMS_PER_PAGE_OPTIONS[2],
  100: ITEMS_PER_PAGE_OPTIONS[3]
}

export const INITIAL_ITEMS_PER_PAGE_OPTION = ITEMS_PER_PAGE_OPTIONS[0]
export const INITIAL_SORT_BY_OPTION = SORT_BY_OPTIONS[0]
export const INITIAL_SORT_ORDER_OPTION = SORT_ORDER_OPTIONS[0]
