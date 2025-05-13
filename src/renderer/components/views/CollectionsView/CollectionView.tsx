import { SamplesResultsView } from '../SamplesResultsView/SamplesResultsView'
import { FocusedViewHeader } from '#/components/FocusedViewHeader'
import { $search } from '#/stores/search.store'
import React from 'react'
import { FilterBar } from '#/components/FilterBar'
import { $ui } from '#/stores/ui.store'
import { ViewBox } from '#/components/ui/ViewBox'
import { SampleResultsList } from '../SamplesResultsView/AssetResultsList/AssetResultsList'
import { TagCloudHeader } from '../SamplesResultsView/SearchFilterSection/TagCloudHeader'
import { $collections } from '#/stores/collections.store'

export const CollectionView = () => {
  const routeEntityType = $ui.routeEntityType.use()
  const routeEntityId = $ui.routeEntityId.use()
  const collection = $collections.useCollection(routeEntityId)

  React.useEffect(() => {
    if (routeEntityType !== 'collection') return
    if (!routeEntityId) return
    $search.filters.set.reset()
    $search.results.set.reset()
    $search.pagination.set.reset()
    $search.filters.set({ collectionId: routeEntityId })
    $search.searchSamples()
  }, [routeEntityType, routeEntityId])

  if (!collection) return

  return (
    <>
      <ViewBox id="CollectionView">
        <FocusedViewHeader
          id={collection.id}
          kind="Collection"
          name={collection.name}
          description={collection.sampleIds.lengt + ' samples'}
          sampleCount={collection.sampleIds.lengt}
        />
        <TagCloudHeader />
        <SampleResultsList />
      </ViewBox>
      <FilterBar />
    </>
  )
}
