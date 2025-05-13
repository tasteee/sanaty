import { $folders } from '#/stores/folders.store'
import { SamplesResultsView } from '../SamplesResultsView/SamplesResultsView'
import { FocusedViewHeader } from '#/components/FocusedViewHeader'
import { $search } from '#/stores/search.store'

export const FolderView = () => {
  const folderId = $search.filters.use((state) => state.folderId)
  const folder = $folders.useFolder(folderId)
  if (!folder) return <p>4040404</p>

  return (
    <SamplesResultsView id="FolderView">
      <FocusedViewHeader kind="Folder" sampleCount={folder.sampleCount} name={folder.name} description={folder.path} id={folder._id} />
    </SamplesResultsView>
  )
}
