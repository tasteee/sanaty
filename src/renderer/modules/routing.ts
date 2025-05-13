import { $search } from '#/stores/search.store'
import { navigate } from 'wouter/use-browser-location'

export const navigateTo = (path: string) => {
  $search.reset()
  navigate(path)
}
