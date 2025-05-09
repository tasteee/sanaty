import { datass } from 'datass'

const $isIndexingFolder = datass.boolean(false)
const $isSetupDone = datass.boolean(false)
const $isPlayingSound = datass.boolean(false)

export const $main = {
  isSetupDone: $isSetupDone,
  isIndexingFolder: $isIndexingFolder,
  isPlayingSound: $isPlayingSound
}

globalThis.$main = $main
