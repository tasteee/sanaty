import { $playback } from '#/stores/playback.store'
import { useEffect, useRef } from 'react'
import { useLocation } from 'wouter'

export const PlaybackHandler = () => {
  const [location] = useLocation()
  const isPlaying = $playback.isPlayingSound.use()
  const samplePath = $playback.usePlayingSamplePath()
  const audioContextRef = useRef(null)
  const audioBufferRef = useRef(null)
  const sourceNodeRef = useRef(null)
  const loadingRef = useRef(false)

  useEffect(() => {
    stopPlayback()
  }, [location])

  // Initialize AudioContext
  useEffect(() => {
    if (!audioContextRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      audioContextRef.current = new AudioContext()
    }

    return () => {
      stopPlayback()
      if (audioContextRef.current) {
        audioContextRef.current.close()
        audioContextRef.current = null
      }
    }
  }, [])

  // Stop current playback
  const stopPlayback = () => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop()
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
  const playAudioBuffer = (buffer) => {
    if (!buffer || !audioContextRef.current) return

    // Create a new source node
    const sourceNode = audioContextRef.current.createBufferSource()
    sourceNode.buffer = buffer
    sourceNode.connect(audioContextRef.current.destination)

    // Store the source node for later stopping
    sourceNodeRef.current = sourceNode

    // Start playback
    sourceNode.start()

    // Set up ended callback
    sourceNode.onended = () => {
      if (sourceNodeRef.current === sourceNode) {
        sourceNodeRef.current = null
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
    const handleSamplePathChange = async () => {
      // Stop any current playback
      stopPlayback()

      if (samplePath && isPlaying) {
        // Load and play the new sample
        const buffer = await loadAudioFile(samplePath)
        if (buffer) {
          audioBufferRef.current = buffer
          playAudioBuffer(buffer)
        }
      }
    }

    handleSamplePathChange()
  }, [samplePath, isPlaying])

  // No UI is rendered from this component
  return null
}
