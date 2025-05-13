import { $loaders } from '#/stores/loaders.store'
import { $search } from '#/stores/search.store'
import { $ui } from '#/stores/ui.store'
import { navigate } from 'wouter/use-browser-location'

export const navigateTo = (path: string) => {
  console.log('navigating to ', path)
  $loaders.start('isLoadingView')
  $ui.setActiveSampleId('')
  $ui.setActiveSampleIndex(-1)
  navigate(path)

  setTimeout(() => {
    $loaders.stop('isLoadingView')
  }, 200)
}
