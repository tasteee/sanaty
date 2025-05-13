import { SamplesResultsView } from '../SamplesResultsView/SamplesResultsView'
import { $folders } from '#/stores/folders.store'
import { FocusedViewHeader } from '#/components/FocusedViewHeader'
import { $search } from '#/stores/search.store'
import React from 'react'
import { FilterBar } from '#/components/FilterBar'
import { $ui } from '#/stores/ui.store'
import { ViewBox } from '#/components/ui/ViewBox'
import { SampleResultsList } from '../SamplesResultsView/AssetResultsList/AssetResultsList'
import { TagCloudHeader } from '../SamplesResultsView/SearchFilterSection/TagCloudHeader'

export const FolderView = () => {
  const routeEntityType = $ui.routeEntityType.use()
  const routeEntityId = $ui.routeEntityId.use()
  const folder = $folders.useFolder(routeEntityId)

  React.useEffect(() => {
    if (routeEntityType !== 'folder') return
    if (!routeEntityId) return
    $search.filters.set.reset()
    $search.results.set.reset()
    $search.pagination.set.reset()
    $search.filters.set({ folderId: routeEntityId })
    $search.searchSamples()
  }, [routeEntityType, routeEntityId])

  console.log('>>>', folder)
  if (!folder) return

  return (
    <>
      <ViewBox id="FolderView" className="SamplesResultsView">
        <FocusedViewHeader
          id={folder.id}
          kind="Folder"
          name={folder.name}
          description={folder.sampleCount + ' samples'}
          sampleCount={folder.sampleCount}
        />
        <TagCloudHeader />
        <SampleResultsList />
      </ViewBox>
      <FilterBar />
    </>
  )
}
