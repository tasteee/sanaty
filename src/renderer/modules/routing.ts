import { $loaders } from '#/stores/loaders.store'
import { $playback } from '#/stores/playback.store'
import { $search } from '#/stores/search.store'
import { $ui } from '#/stores/ui.store'
import { navigate } from 'wouter/use-browser-location'

export const navigateTo = (path: string) => {
  console.log('navigating to ', path)
  $loaders.start('isLoadingView')
  $playback.clearActiveSample()
  navigate(path)

  setTimeout(() => {
    $loaders.stop('isLoadingView')
  }, 200)
}
