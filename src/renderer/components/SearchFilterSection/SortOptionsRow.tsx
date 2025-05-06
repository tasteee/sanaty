import { Flex, Text } from '#/components'
import { SortOrderSelector } from './SortOrderSelector'
import { SortBySelector } from './SortBySelector'
import { $assets } from '#/stores/assets'

export const SortOptionsRow = () => {
  return (
    <Flex justify="space-between" align="center" padding="4px">
      <SearchResultCount />
      <Flex gap="2" justify="flex-end">
        <SortBySelector />
        <SortOrderSelector />
      </Flex>
    </Flex>
  )
}

const SearchResultCount = () => {
  const assetCount = $assets.list.use((list) => list.length)
  return <Text color="gray.500">{assetCount} results</Text>
}
