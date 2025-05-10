import { datass } from 'datass'

const $isIndexingFolder = datass.boolean(false)
const $isSetupDone = datass.boolean(false)
const $isPlayingSound = datass.boolean(false)
const $isCompactViewEnabled = datass.boolean(false)

const $missingFolderIds = datass.array([])
const $missingSampleIds = datass.array([])

const $fileSystemErrors = datass.object({
  missingFolders: [],
  missingSamples: [],
  missingFolderIds: [],
  missingSampleIds: []
})

const verifyFoldersAndSamples = async () => {
  const results = await window.electron.verifyFoldersAndSamples()

  $fileSystemErrors.set({
    missingFolders: results.missingFolders,
    missingSamples: results.missingSamples,
    missingFolderIds: results.missingFolderIds,
    missingSampleIds: results.missingSampleIds
  })
}

export const $routing = datass.object({
  search: '',
  params: {},
  location: ''
})

export const $main = {
  isSetupDone: $isSetupDone,
  isIndexingFolder: $isIndexingFolder,
  isPlayingSound: $isPlayingSound,
  isCompactViewEnabled: $isCompactViewEnabled,
  fileSystemErrors: $fileSystemErrors,
  verifyFoldersAndSamples
}

globalThis.$main = $main
