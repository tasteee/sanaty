import { Flex, Text } from '@mantine/core'
import { $search } from '#/stores/search.store'
import { Select } from '@mantine/core'

export const SortOptionsRow = () => {
  return (
    <Flex className="SortOptionsRow" justify="space-between" align="center" p="4px">
      <Flex gap="8" align="center">
        <SearchResultCount />
      </Flex>
      <Flex gap="xs" justify="flex-end">
        {/* <ItemsPerPageSelector /> */}
        <SortBySelector />
        <SortOrderSelector />
      </Flex>
    </Flex>
  )
}

const SearchResultCount = () => {
  const sampleCount = $search.useResultCount()
  return <Text c="dimmed">{sampleCount} results</Text>
}

export const ItemsPerPageSelector = () => {
  const itemsPerPage = $search.usePaginationItemsPerPage()
  const onChange = (value) => $search.setItemsPerPage(value)

  return (
    <Select
      size="xs"
      style={{ width: 120 }}
      value={itemsPerPage}
      onChange={onChange}
      className="ItemsPerPageSelector"
      placeholder="Items Per Page"
      data={['10', '20', '50']}
    />
  )
}

export const SortOrderSelector = () => {
  const sortOrder = $search.useSortOrderFilter()
  const onChange = (value) => $search.setSortOrder(value)

  return (
    <Select
      size="xs"
      style={{ width: 120 }}
      value={sortOrder}
      onChange={onChange}
      className="SortOrderSelector"
      placeholder="Sort Order"
      data={['Ascending', 'Descending']}
    />
  )
}

export const SortBySelector = () => {
  const sortBy = $search.useSortByFilter()
  const onChange = (value) => $search.setSortBy(value)

  return (
    <Select
      size="xs"
      style={{ width: 120 }}
      className="SortBySelector"
      placeholder="Sort By"
      value={sortBy}
      onChange={onChange}
      data={['Name', 'Date Added', 'Duration']}
    />
  )
}
