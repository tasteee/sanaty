import { FocusedViewHeader } from '#/components/FocusedViewHeader'
import { Text } from '@chakra-ui/react/typography'
import { FilterBar } from '#/components/FilterBar'
import { $ui } from '#/stores/ui.store'
import { SampleResultsList } from '../SamplesResultsView/AssetResultsList/AssetResultsList'
import { TagCloudHeader } from '../SamplesResultsView/SearchFilterSection/TagCloudHeader'
import { $collections } from '#/stores/collections.store'
import { View } from '#/components/View'
import { SearchControls } from '#/components/SearchControls'

export const CollectionView = () => {
  const routeEntityId = $ui.routeEntityId.use()
  const collection = $collections.useCollection(routeEntityId)
  if (!collection) return null

  const title = `Collection: ${collection.name}`

  return (
    <>
      <View id="CollectionView" className="CollectionView">
        <View.Heading title={title} iconName="mingcute:playlist-2-fill">
          <SearchControls />
        </View.Heading>
        <SampleResultsList key={routeEntityId} />
      </View>
    </>
  )
}
