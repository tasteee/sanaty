import './AudioPlayer.css'
import React, { useEffect, useState, useRef } from 'react'
import { $ui } from '#/stores/ui.store'
import { $search } from '#/stores/search.store'
import { $playback } from '#/stores/playback.store'

export const AudioPlayer = () => {
  const audioRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentSample, setCurrentSample] = useState(null)

  const activeSampleId = $playback.activeSampleId.use()
  const isPlaying = $playback.isPlayingSound.use()
  const activeAssetIndex = $playback.activeAssetIndex.use()

  useEffect(() => {
    if (!activeSampleId) return setCurrentSample(null)
    const sample = $search.useSampleResult(activeSampleId)
    setCurrentSample(sample)
  }, [activeSampleId])

  useEffect(() => {
    if (!audioRef.current || !currentSample) return
    const audioElement = audioRef.current

    // Update UI store with audio element reference
    $playback.currentAudio.set(audioElement)

    const handlePlay = () => {
      $playback.isPlayingSound.set(true)
    }

    const handleEnded = () => {
      $playback.isPlayingSound.set(false)
    }

    const handlePause = () => {
      $playback.isPlayingSound.set(false)
    }

    audioElement.addEventListener('play', handlePlay)
    audioElement.addEventListener('ended', handleEnded)
    audioElement.addEventListener('pause', handlePause)

    return () => {
      audioElement.removeEventListener('play', handlePlay)
      audioElement.removeEventListener('ended', handleEnded)
      audioElement.removeEventListener('pause', handlePause)
    }
  }, [currentSample])

  useEffect(() => {
    if (!audioRef.current || !currentSample) return

    if (!isPlaying) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      return
    }

    setIsLoading(true)

    // In a real implementation, you would load the file here
    // For example: audioRef.current.src = currentSample.path

    // Simulating file loading
    setTimeout(() => {
      setIsLoading(false)
      audioRef.current.play().catch((err) => {
        console.error('Error playing audio:', err)
        $playback.isPlayingSound.set(false)
      })
    }, 100)
  }, [isPlaying, currentSample])

  return (
    <div className="AudioPlayer">
      {/* Hidden audio element */}
      <audio ref={audioRef} />

      {/* Optional: Visual indicator for which sample is playing */}
      {currentSample && (
        <div className="AudioPlayerVisualizer">
          {isLoading ? (
            <span>Loading audio...</span>
          ) : (
            isPlaying && (
              <div className="visualizer-bars">
                {/* Audio visualizer bars */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="visualizer-bar" />
                ))}
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}
