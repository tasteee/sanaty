import { Flex, Text, Button } from '#/components'
import { SortOrderSelector } from './SortOrderSelector'
import { SortBySelector } from './SortBySelector'
import { $assets } from '#/stores/assets'
import { $main } from '#/stores/main'

export const SortOptionsRow = () => {
  const isTagCloudShown = $main.isTagCloudShown.use()
  const toggleTagCloudText = isTagCloudShown ? 'Hide' : 'Show'

  return (
    <Flex justify="space-between" align="center" padding="4px">
      <Flex gap="8" align="center">
        <SearchResultCount />
        <Text color="gray.500" textStyle="sm" onClick={() => $main.isTagCloudShown.set.toggle()} className="clickableText">
          {toggleTagCloudText} tag cloud
        </Text>
      </Flex>
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
