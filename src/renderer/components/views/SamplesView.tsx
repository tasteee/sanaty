import React from 'react'
import { $search } from '#/stores/search.store'
import { SamplesResultsView } from './SamplesResultsView/SamplesResultsView'
import { FilterBar } from '../FilterBar'
import { ViewHeading } from '../ViewHeading'
import { ViewBox } from '../ui/ViewBox'
import { SampleResultsList } from './SamplesResultsView/AssetResultsList/AssetResultsList'
import { TagCloudHeader } from './SamplesResultsView/SearchFilterSection/TagCloudHeader'

export const SamplesView = () => {
  React.useEffect(() => {
    $search.filters.set.reset()
    $search.results.set.reset()
    $search.pagination.set.reset()
    $search.searchSamples()
  }, [])

  return (
    <>
      <ViewBox id="SamplesView">
        <ViewHeading title="Samples" iconName="material-symbols-light:audio-file-rounded" />

        <TagCloudHeader />
        <SampleResultsList />
      </ViewBox>
      <FilterBar />
    </>
  )
}
