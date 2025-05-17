import { $folders } from '#/stores/folders.store'
import { FocusedViewHeader } from '#/components/FocusedViewHeader'
import { FilterBar } from '#/components/FilterBar'
import { $ui } from '#/stores/ui.store'
import { SampleResultsList } from './AssetResultsList/AssetResultsList'
import { TagCloudHeader } from './SearchFilterSection/TagCloudHeader'
import { View } from '#/components/View'
import { SearchControls } from '#/components/SearchControls'
import { Button, Flex } from '@mantine/core'
import { navigateTo } from '#/modules/routing'

export const FolderView = () => {
  const routeEntityId = $ui.routeEntityId.use()
  const folder = $folders.useFolder(routeEntityId)
  if (!folder) return
  const title = `Folders: ${folder.name}`

  const onRemoveClick = () => $folders.remove(folder.id)
  const onRefreshClick = () => $folders.refresh(folder.id)
  const onOpenClick = () => window.electron.openExplorerAtPath(folder.path)

  return (
    <>
      <View id="FolderView" className="FolderView">
        <View.Heading title={title} iconName="mingcute:folders-line">
          <Flex gap="sm">
            <Button variant="default" size="xs" onClick={onRefreshClick}>
              Refresh Folder
            </Button>
            <Button variant="default" size="xs" onClick={onRemoveClick}>
              Remove Folder
            </Button>
            <Button variant="default" size="xs" onClick={onOpenClick}>
              Open Folder
            </Button>
          </Flex>
        </View.Heading>
        <SearchControls />
        <SampleResultsList key={routeEntityId} />
      </View>
    </>
  )
}
