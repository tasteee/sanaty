import React from 'react'
import { ViewBox } from '../ui/ViewBox'
import { SampleResultsList } from './SamplesResultsView/AssetResultsList/AssetResultsList'
import { SearchFilterSection } from './SamplesResultsView/SearchFilterSection'
import { $search } from '#/stores/search.store'

export const SamplesView = () => {
  React.useEffect(() => {
    console.log('SamplesView useEffect')
    $search.filters.set.reset()
    $search.results.set.reset()
    $search.pagination.set.reset()
    $search.searchSamples()
    console.log('SamplesView useEffect done')
  }, [])

  return (
    <ViewBox id="SamplesView" className="SamplesView">
      <SearchFilterSection />
      <SampleResultsList />
    </ViewBox>
  )
}
