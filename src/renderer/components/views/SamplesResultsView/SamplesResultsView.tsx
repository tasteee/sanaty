import { useRoute } from 'wouter'
import { $samplesViewStore } from './samplesView.store'
import { SampleResultsList } from '#/components/views/SamplesResultsView/AssetResultsList/AssetResultsList'
import { SearchFilterSection } from '#/components/views/SamplesResultsView/SearchFilterSection'
import { ViewBox } from '#/components/ui/ViewBox'
import { useMount, useUnmount } from '@siberiacancode/reactuse'

// Used for /samples view and /collection/:id view.
// Can accept props.children to add in collection or folder view header.
// Resets filters/results on unmount.
// Refetches results on mount.

export const SamplesResultsView = (props) => {
  return (
    <ViewBox id={props.id} className="SamplesView">
      {props.children}
      <SearchFilterSection />
      <SampleResultsList />
    </ViewBox>
  )
}
