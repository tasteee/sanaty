import { $playback } from '#/stores/playback.store'
import { useEffect, useRef } from 'react'
import { useLocation } from 'wouter'

export const PlaybackHandler = () => {
  const [location] = useLocation()
  const volume = $playback.volume.use()
  const isPlaying = $playback.isPlayingSound.use()
  const samplePath = $playback.usePlayingSamplePath()
  const audioContextRef = useRef(null)
  const audioBufferRef = useRef(null)
  const sourceNodeRef = useRef(null)
  const gainNodeRef = useRef(null)
  const loadingRef = useRef(false)

  useEffect(() => {
    stopPlayback()
  }, [location])

  // Initialize AudioContext
  useEffect(() => {
    if (!audioContextRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      audioContextRef.current = new AudioContext()
      // Create gain node for volume control
      gainNodeRef.current = audioContextRef.current.createGain()
      gainNodeRef.current.connect(audioContextRef.current.destination)
    }

    return () => {
      stopPlayback()
      if (audioContextRef.current) {
        audioContextRef.current.close()
        audioContextRef.current = null
        gainNodeRef.current = null
      }
    }
  }, [])

  // Update volume when it changes
  useEffect(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      // Convert volume range (0-100) to gainNode value (0-1)
      const normalizedVolume = volume / 100

      // Use linear ramp for smoother volume changes
      const currentTime = audioContextRef.current.currentTime
      gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, currentTime)
      gainNodeRef.current.gain.linearRampToValueAtTime(normalizedVolume, currentTime + 0.05)
    }
  }, [volume])

  // Stop current playback
  const stopPlayback = () => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop()
      } catch (e) {
        // Ignore errors if the source was already stopped
      }
      sourceNodeRef.current.disconnect()
      sourceNodeRef.current = null
    }
  }

  // Load and decode audio file
  const loadAudioFile = async (filePath) => {
    if (!filePath || filePath === '' || !audioContextRef.current) return null

    try {
      loadingRef.current = true
      // For Electron renderer process, we need to use IPC to get the file
      // This assumes you have an IPC handler set up in your main process
      const [audioData] = await window.electron.getAudioData(filePath)
      const audioBuffer = await audioContextRef.current.decodeAudioData(audioData)
      return audioBuffer
    } catch (error) {
      console.error('Failed to load audio file:', error)
      return null
    } finally {
      loadingRef.current = false
    }
  }

  // Play the loaded audio buffer
  const playAudioBuffer = async (buffer) => {
    if (!buffer || !audioContextRef.current || !gainNodeRef.current) return

    // Resume the AudioContext if it's suspended
    if (audioContextRef.current.state === 'suspended') {
      try {
        await audioContextRef.current.resume()
      } catch (error) {
        console.error('Failed to resume audio context:', error)
        return
      }
    }

    // Create a new source node
    const sourceNode = audioContextRef.current.createBufferSource()
    sourceNode.buffer = buffer

    // Connect to gain node for volume control
    sourceNode.connect(gainNodeRef.current)

    // Store the source node for later stopping
    sourceNodeRef.current = sourceNode

    // Start playback
    sourceNode.start()

    // Set up ended callback
    sourceNode.onended = () => {
      if (sourceNodeRef.current === sourceNode) {
        sourceNodeRef.current = null
        $playback.isPlayingSound.set(false)
        // You might want to notify your state here that playback has ended
      }
    }
  }

  // Handle changes to isPlaying state
  useEffect(() => {
    if (!isPlaying) {
      stopPlayback()
    }
  }, [isPlaying])

  // Handle changes to samplePath
  useEffect(() => {
    let isMounted = true

    const handleSamplePathChange = async () => {
      // Stop any current playback
      stopPlayback()

      if (samplePath && isPlaying && isMounted) {
        try {
          // Resume context if needed
          if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
            await audioContextRef.current.resume()
          }

          // Load and play the new sample
          const buffer = await loadAudioFile(samplePath)
          if (buffer && isMounted) {
            audioBufferRef.current = buffer
            playAudioBuffer(buffer)
          }
        } catch (error) {
          console.error('Error during sample playback:', error)
        }
      }
    }

    handleSamplePathChange()

    return () => {
      isMounted = false
    }
  }, [samplePath, isPlaying])

  // No UI is rendered from this component
  return null
}
