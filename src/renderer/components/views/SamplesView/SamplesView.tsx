import { useRoute } from 'wouter'
import { $samplesViewStore } from './samplesView.store'
import { SampleResultsList } from '#/components/views/SamplesView/AssetResultsList/AssetResultsList'
import { PlaybackBar } from '#/components/views/SamplesView/PlaybackBar/PlaybackBar'
import { SearchFilterSection } from '#/components/views/SamplesView/SearchFilterSection'
import { ViewBox } from '#/components/ui/ViewBox'
import { useMount, useUnmount } from '@siberiacancode/reactuse'

// Used for /samples view and /collection/:id view.
// Can accept props.children to add in collection or folder view header.
// Resets filters/results on unmount.
// Refetches results on mount.

export const SamplesView = (props) => {
  const [isFoldersRoute, foldersRouteParams] = useRoute('/folders/:folderId')
  const [isCollectionsRoute, collectionsRouteParams] = useRoute('/collections/:collectionId')

  useMount(() => {
    const { folderId } = foldersRouteParams ? foldersRouteParams : { folderId: '' }
    const { collectionId } = collectionsRouteParams ? collectionsRouteParams : { collectionId: '' }
    if (isFoldersRoute) $samplesViewStore.filters.set({ folderId })
    if (isCollectionsRoute) $samplesViewStore.filters.set({ collectionId })
    $samplesViewStore.submitSearch()
  })

  useUnmount(() => {
    $samplesViewStore.filters.set.reset()
    $samplesViewStore.results.set.reset()
  })

  return (
    <ViewBox id={props.id} className="SamplesView">
      {props.children}
      <SearchFilterSection />
      <SampleResultsList />
      <PlaybackBar />
    </ViewBox>
  )
}
