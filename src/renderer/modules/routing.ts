import { $playback } from '#/stores/playback.store'
import { navigate } from 'wouter/use-browser-location'

export const navigateTo = (path: string) => {
  $playback.reset()
  navigate(path)
}
