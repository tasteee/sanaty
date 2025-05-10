import { Flex, Text, Button } from '#/components'
import { SortOrderSelector } from './SortOrderSelector'
import { SortBySelector } from './SortBySelector'
import { $samplesViewStore } from '../samplesView.store'
import { ItemsPerPageSelector } from './ItemsPerPageSelector'

export const SortOptionsRow = () => {
  const isTagCloudShown = $samplesViewStore.isTagCloudShown.use()
  const toggleTagCloudText = isTagCloudShown ? 'Hide' : 'Show'

  return (
    <Flex justify="space-between" align="center" padding="4px">
      <Flex gap="8" align="center">
        <SearchResultCount />
        <Text color="gray.500" textStyle="sm" onClick={$samplesViewStore.toggleTagCloudVisibility} className="clickableText">
          {toggleTagCloudText} tag cloud
        </Text>
      </Flex>
      <Flex gap="2" justify="flex-end">
        <ItemsPerPageSelector />
        <SortBySelector />
        <SortOrderSelector />
      </Flex>
    </Flex>
  )
}

const SearchResultCount = () => {
  const assetCount = $samplesViewStore.results.use((list) => list.length)
  return <Text color="gray.500">{assetCount} results</Text>
}
