import { FocusedViewHeader } from '#/components/FocusedViewHeader'
import { Text } from '@chakra-ui/react/typography'
import { FilterBar } from '#/components/FilterBar'
import { $ui } from '#/stores/ui.store'
import { ViewBox } from '#/components/ui/ViewBox'
import { SampleResultsList } from '../SamplesResultsView/AssetResultsList/AssetResultsList'
import { TagCloudHeader } from '../SamplesResultsView/SearchFilterSection/TagCloudHeader'
import { $collections } from '#/stores/collections.store'

export const CollectionView = () => {
  const routeEntityId = $ui.routeEntityId.use()
  const collection = $collections.useCollection(routeEntityId)
  if (!collection) return <Text>Loading...</Text>
  const sampleCount = collection.sampleIds.length

  return (
    <>
      <ViewBox id="CollectionView">
        <FocusedViewHeader
          id={collection.id}
          kind="Collection"
          name={collection.name}
          description={sampleCount + ' samples'}
          sampleCount={sampleCount}
        />
        <TagCloudHeader />
        <SampleResultsList key={routeEntityId} />
      </ViewBox>
      <FilterBar />
    </>
  )
}
