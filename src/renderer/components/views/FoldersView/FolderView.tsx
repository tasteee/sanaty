import { $folders } from '#/stores/folders.store'
import { FocusedViewHeader } from '#/components/FocusedViewHeader'
import { FilterBar } from '#/components/FilterBar'
import { $ui } from '#/stores/ui.store'
import { SampleResultsList } from '../SamplesResultsView/AssetResultsList/AssetResultsList'
import { TagCloudHeader } from '../SamplesResultsView/SearchFilterSection/TagCloudHeader'
import { View } from '#/components/View'
import { SearchControls } from '#/components/SearchControls'

export const FolderView = () => {
  const routeEntityId = $ui.routeEntityId.use()
  const folder = $folders.useFolder(routeEntityId)
  if (!folder) return
  const title = `Folders: ${folder.name}`

  return (
    <>
      <View id="FolderView" className="FolderView">
        <View.Heading title={title} iconName="mingcute:folders-line">
          <SearchControls />
        </View.Heading>
        <SampleResultsList key={routeEntityId} />
      </View>
    </>
  )
}
