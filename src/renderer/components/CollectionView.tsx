import { FocusedViewHeader } from '#/components/FocusedViewHeader'
import { Text } from '@chakra-ui/react/typography'
import { FilterBar } from '#/components/FilterBar'
import { $ui } from '#/stores/ui.store'
import { SampleResultsList } from './AssetResultsList'
import { TagCloudHeader } from './SearchFilterSection/TagCloudHeader'
import { $collections } from '#/stores/collections.store'
import { View } from '#/components/View'
import { SearchControls } from '#/components/SearchControls'
import { Button, Flex } from '@mantine/core'

export const CollectionView = () => {
  const routeEntityId = $ui.routeEntityId.use()
  const collection = $collections.useCollection(routeEntityId)
  if (!collection) return null

  return (
    <>
      <View id="CollectionView" className="CollectionView">
        <View.Heading title={`Collction: ${collection.name}`} iconName="mingcute:playlist-2-fill">
          <Flex gap="sm">
            <Button variant="default" size="xs" onClick={() => $ui.startEditingCollection(collection.id)}>
              Edit Collection
            </Button>
            <Button variant="default" size="xs" onClick={() => $collections.delete(collection.id)}>
              Delete Collection
            </Button>
          </Flex>
        </View.Heading>
        <SearchControls />
        <SampleResultsList key={routeEntityId} />
      </View>
    </>
  )
}
