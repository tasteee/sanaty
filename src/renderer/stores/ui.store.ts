import { datass } from 'datass'

class UiStore {
  isDragging = datass.boolean(false)
  isSearchableViewActive = datass.boolean(false)
  routeEntityType = datass.string('')
  routeEntityId = datass.string('')
  isSetupDone = datass.boolean(false)
  isIndexingFolder = datass.boolean(false)
  isCompactViewEnabled = datass.boolean(false)
  isTagCloudOpen = datass.boolean(true)
  activeTagCloudCategory = datass.string('All')
}

export const $ui = new UiStore()
globalThis.$ui = $ui
