import { $folders } from '#/stores/folders'
import { useLocation, useRoute } from 'wouter'
import { SamplesResultsView } from '../SamplesResultsView/SamplesResultsView'
import { $samplesViewStore } from '../SamplesResultsView/samplesView.store'
import { FocusedViewHeader } from '#/components/FocusedViewHeader'
import React from 'react'

export const FolderView = () => {
  const route = useRoute('/folders/folder/:folderId')
  const params = route[1] as any
  const folder = $folders.useFolder(params.folderId)
  const [location] = useLocation()

  React.useEffect(() => {
    $samplesViewStore.filters.set.reset()
    $samplesViewStore.results.set.reset()
    $samplesViewStore.currentPageResults.set.reset()
    $samplesViewStore.filters.set({ folderId: params.folderId })
    $samplesViewStore.submitSearch()
  }, [location])

  return (
    <SamplesResultsView id="FolderView">
      <FocusedViewHeader
        kind="Folder"
        sampleCount={folder.sampleCount}
        name={folder.name}
        description={folder.path}
        id={folder._id}
      />
    </SamplesResultsView>
  )
}
