import React from 'react'
import { SamplesResultsView } from './SamplesResultsView/SamplesResultsView'
import { $samplesViewStore } from './SamplesResultsView/samplesView.store'

export const SamplesView = () => {
  React.useEffect(() => {
    $samplesViewStore.filters.set.reset()
    $samplesViewStore.results.set.reset()
    $samplesViewStore.currentPageResults.set.reset()
    $samplesViewStore.submitSearch()
  }, [location])

  return <SamplesResultsView />
}
