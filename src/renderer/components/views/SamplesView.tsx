import React from 'react'
import { $search } from '#/stores/search.store'
import { FilterBar } from '../FilterBar'
import { ViewHeading } from '../ViewHeading'
import { ViewBox } from '../ui/ViewBox'
import { SampleResultsList } from './SamplesResultsView/AssetResultsList/AssetResultsList'
import { TagCloudHeader } from './SamplesResultsView/SearchFilterSection/TagCloudHeader'

export const SamplesView = () => {
  return (
    <>
      <ViewBox id="SamplesView">
        <ViewHeading title="Samples" iconName="material-symbols-light:audio-file-rounded" />
        <TagCloudHeader />
        <SampleResultsList key="SamplesView" />
      </ViewBox>
      <FilterBar />
    </>
  )
}
