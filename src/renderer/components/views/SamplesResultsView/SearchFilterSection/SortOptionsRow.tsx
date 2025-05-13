import { Flex, Text } from '#/components'
import { SortOrderSelector } from './SortOrderSelector'
import { SortBySelector } from './SortBySelector'
import { ItemsPerPageSelector } from './ItemsPerPageSelector'
import { $ui } from '#/stores/ui.store'
import { $search } from '#/stores/search.store'

export const SortOptionsRow = () => {
  const isTagCloudShown = $ui.isTagCloudOpen.use()
  const toggleTagCloudText = isTagCloudShown ? 'Hide' : 'Show'
  const toggleTagcloud = () => $ui.isTagCloudOpen.set.toggle()

  return (
    <Flex className="SortOptionsRow" justify="space-between" align="center" padding="4px">
      <Flex gap="8" align="center">
        <SearchResultCount />
        <Text color="gray.500" textStyle="sm" onClick={toggleTagcloud} className="clickableText">
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
  const sampleCount = $search.useResultCount()
  return <Text color="gray.500">{sampleCount} results</Text>
}
