// src/renderer/stores/ui.ts
import { makeGlobal } from '#/modules/_global'
import { _store } from '#/modules/_stores'
import { datass } from 'datass'

const foo = (event) => {
  if (event.key === 'Escape') {
    $ui.turnAddToCollectionModeOff()
  }
}

class UiStore {
  currentAudio = datass.object(null)

  isCreateCollectionDialogOpen = datass.boolean(false)
  isEditCollectionDialogOpen = datass.boolean(false)

  routeEntityType = datass.string('')
  routeEntityId = datass.string('')

  isSetupDone = datass.boolean(false)

  isIndexingFolder = datass.boolean(false)

  // this will probably go away.
  isCompactViewEnabled = datass.boolean(false)

  // is the tag cloud visible in the
  // search filters section?
  isTagCloudOpen = datass.boolean(true)

  // which tag cloud category is open in the
  // search filters section.
  activeTagCloudCategory = datass.string('All')

  // index of the active sample in the full
  // search results.
  activeAssetIndex = datass.number(-1)

  // when a sample is activated, its audio will play
  // through one time.
  isPlayingSound = datass.boolean(false)

  // The id of the active sample in the search results.
  activeSampleId = datass.string('')

  setActiveSampleId = (id) => {
    console.log('setttttting id', { id })
    this.activeSampleId.set(id)
  }

  setActiveSampleIndex = (index) => {
    console.log('setttttting indexxxx', index)
    this.activeAssetIndex.set(index)
  }

  // When the user clicks the PLUS icon on a sample
  // in the search results, addToCollection mode is enabled.
  // The collections in the sidebar are highlighted and
  // the user can click one to add the selected sample
  // to the selected collection.

  // when add to collection mode is active, if the user presses
  // escape or if they click the plus icon again (which is now an x icon)
  // it will turn add to collection mode off. Or once they select a
  // collection, the sampleid will be added to that collection and
  // add to collection mode will be turned off.
  isAddingToCollection = datass.boolean(false)
  collectionAdditionSampleId = datass.string('')

  turnAddToCollectionModeOn(sampleId) {
    this.isAddingToCollection.set(true)
    this.collectionAdditionSampleId.set(sampleId)
    window.addEventListener('keydown', foo)
  }

  turnAddToCollectionModeOff() {
    this.isAddingToCollection.set(false)
    this.collectionAdditionSampleId.set('')
    window.removeEventListener('keydown', foo)
  }
}

export const $ui = new UiStore()
globalThis.ui = $ui
