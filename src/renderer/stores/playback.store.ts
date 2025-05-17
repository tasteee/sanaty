import { toNumber } from '#/modules/number'
import { datass } from 'datass'
import store from 'store'

const INITIAL_VOLUME = toNumber(store.get('volume') || '50')

class PlaybackStore {
  isPlayingSound = datass.boolean(false)
  activeAssetIndex = datass.number(-1)
  activeSampleId = datass.string('')
  activeSample = datass.object({})
  currentAudio = datass.object(null)
  volume = datass.number(INITIAL_VOLUME)

  setActiveSampleId = (id) => {
    this.activeSampleId.set(id)
  }

  setActiveSampleIndex = (index) => {
    this.activeAssetIndex.set(index)
  }

  usePlayingSamplePath = () => {
    return this.activeSample.use((state: any) => state.path || '')
  }

  pausePlayback = () => {
    this.isPlayingSound.set(false)
  }

  reset = () => {
    this.activeAssetIndex.set(-1)
    this.activeSampleId.set('')
    this.activeSample.set({})
    this.isPlayingSound.set(false)
  }

  playSample = (sample, globalIndex) => {
    this.activeAssetIndex.set(globalIndex)
    this.activeSampleId.set(sample.id)
    this.activeSample.set(sample)
    this.isPlayingSound.set(true)
  }
}

export const $playback = new PlaybackStore()
globalThis.playback = $playback

$playback.volume.watch(() => {
  store.set('volume', String($playback.volume.state))
})

$playback.activeSampleId.watch(() => {
  const activeSampleId = $playback.activeSampleId.state
  const activeSample = $playback.activeSample.state as any
  const sampleDataId = activeSample.id

  if (!activeSampleId && activeSample) {
    console.log('no sample id but found active sample... clearing active sample...')
    return $playback.activeSample.set({})
  }

  if (activeSampleId !== sampleDataId) {
    console.log('fetching and setting sample...')
    window.electron.getSampleById(activeSampleId).then((data) => {
      console.log('got sample by id: ', data)
      $playback.activeSample.set(data || {})
    })
  }
})
