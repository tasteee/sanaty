import { datass } from 'datass'

const $isIndexingFolder = datass.boolean(false)
const $isSetupDone = datass.boolean(false)
const $isTagCloudShown = datass.boolean(true)
const $isAddingAssetToCollection = datass.boolean(false)
const $activeAssetIndex = datass.number(-1)
const $isPlayingSound = datass.boolean(false)

export const $main = {
  isSetupDone: $isSetupDone,
  isIndexingFolder: $isIndexingFolder,
  isTagCloudShown: $isTagCloudShown,
  isAddingAssetToCollection: $isAddingAssetToCollection,
  activeAssetIndex: $activeAssetIndex,
  isPlayingSound: $isPlayingSound
}
