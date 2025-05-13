import { $loaders } from '#/stores/loaders.store'
import { $search } from '#/stores/search.store'
import { navigate } from 'wouter/use-browser-location'

export const navigateTo = (path: string) => {
  $loaders.start('isLoadingView')

  // $search.reset()
  console.log('navigating to ', path)
  navigate(path)

  setTimeout(() => {
    $loaders.stop('isLoadingView')
  }, 500)
}
