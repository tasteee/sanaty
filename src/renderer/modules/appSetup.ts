import { $collections } from '#/stores/collections.store'
import { $folders } from '#/stores/folders.store'
import { $likes } from '#/stores/likes.store'
import { $ui } from '#/stores/ui.store'

export const setupAppData = () => {
  console.clear()
  const a = $folders.load()
  const b = $collections.load()
  const c = $likes.load()

  Promise.all([a, b, c]).then(() => {
    console.log('[sanaty] setup done')
    $ui.isSetupDone.set(true)
  })
}
