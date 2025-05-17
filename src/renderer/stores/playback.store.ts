import { datass } from 'datass'

class PlaybackStore {
  isPlayingSound = datass.boolean(false)
  activeAssetIndex = datass.number(-1)
  activeSampleId = datass.string('')
  activeSample = datass.object({})
  currentAudio = datass.object(null)

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

  clearActiveSample = () => {
    this.setActiveSampleIndex(-1)
    this.setActiveSampleId('')
    this.activeSample.set({})
  }

  playSample = (sample, globalIndex) => {
    this.setActiveSampleIndex(globalIndex)
    this.setActiveSampleId(sample.id)
    this.activeSample.set(sample)
    this.isPlayingSound.set(true)
  }
}

export const $playback = new PlaybackStore()
globalThis.playback = $playback

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
