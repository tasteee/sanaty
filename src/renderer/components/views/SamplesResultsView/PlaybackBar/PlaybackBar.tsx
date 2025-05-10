import { useState, useEffect, useRef } from 'react'
import {
  Card,
  Flex,
  Text,
  Box,
  IconButton,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Image,
  Badge,
  Tooltip,
  useColorModeValue
} from '@chakra-ui/react'
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaVolumeMute } from 'react-icons/fa'
import { $samplesViewStore } from '../samplesView.store'

// Custom hook for handling audio playback
const useAudioPlayer = (sample: SampleT | null) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [volume, setVolume] = useState<number>(0.7)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (sample?.filePath) {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      audioRef.current = new Audio(sample.filePath)
      audioRef.current.volume = volume
      setCurrentTime(0)
      setIsPlaying(false)

      const updateTime = () => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime)
        }
      }

      if (audioRef.current) {
        audioRef.current.addEventListener('timeupdate', updateTime)
        audioRef.current.addEventListener('ended', () => setIsPlaying(false))
      }

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('timeupdate', updateTime)
          audioRef.current.removeEventListener('ended', () => setIsPlaying(false))
          audioRef.current.pause()
        }
      }
    }
  }, [sample?.filePath])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch((error) => console.error('Playback failed:', error))
      }
      setIsPlaying(!isPlaying)
    }
  }

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  return {
    isPlaying,
    currentTime,
    volume,
    isMuted,
    togglePlay,
    seekTo,
    setVolume,
    toggleMute
  }
}

// Helper function to format time
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

// Mock function for useActiveSampleId - replace with your actual implementation
const useActiveSampleId = () => {
  return 'sample-123' // Mock active sample ID
}

export const PlaybackBar = () => {
  const activeSample = $samplesViewStore.activeSample.use()
  const player = useAudioPlayer(activeSample)
  if (!activeSample) return

  return (
    <Card className="PlaybackBar" width="full">
      <Card.Body className="PlaybackBarBody" padding="4" gap="2">
        <Flex width="full" align="center" justify="space-between">
          {/* Sample info and artwork */}
          <Flex gap="4" flex="1" align="center">
            <Box minWidth="64px" height="64px" borderRadius="md" overflow="hidden" bg="gray.200">
              {activeSample.artworkUrl ? (
                <Image src={activeSample.artworkUrl} alt={activeSample.name} objectFit="cover" width="64px" height="64px" />
              ) : (
                <Box
                  width="64px"
                  height="64px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  bg="gray.300"
                  color="gray.600"
                >
                  {activeSample.fileExtension.toUpperCase()}
                </Box>
              )}
            </Box>

            <Flex gap="1" direction="column" overflow="hidden">
              <Text fontWeight="bold" noOfLines={1}>
                {activeSample.name}
              </Text>

              <Flex gap="2">
                <Badge colorScheme="purple" borderRadius="full" px="2" fontSize="xs">
                  {activeSample.bpm} BPM
                </Badge>
                <Badge colorScheme="green" borderRadius="full" px="2" fontSize="xs">
                  {activeSample.key} {activeSample.scale}
                </Badge>
              </Flex>
            </Flex>
          </Flex>

          {/* Playback controls */}
          <Flex gap="4" align="center" justify="center" flex="2">
            <Flex gap="2" align="center">
              <IconButton
                aria-label="Previous sample"
                icon={<FaStepBackward />}
                size="sm"
                variant="ghost"
                onClick={() => console.log('Previous sample')}
              />

              <IconButton
                aria-label={player.isPlaying ? 'Pause' : 'Play'}
                icon={player.isPlaying ? <FaPause /> : <FaPlay />}
                size="md"
                colorScheme="blue"
                isRound
                onClick={player.togglePlay}
              />

              <IconButton
                aria-label="Next sample"
                icon={<FaStepForward />}
                size="sm"
                variant="ghost"
                onClick={() => console.log('Next sample')}
              />
            </Flex>

            {/* Progress slider */}
            <Flex gap="2" align="center" flex="1">
              <Text fontSize="xs" minWidth="40px" textAlign="right">
                {formatTime(player.currentTime)}
              </Text>

              <Slider
                aria-label="Playback progress"
                min={0}
                max={activeSample.duration}
                value={player.currentTime}
                onChange={player.seekTo}
                focusThumbOnChange={false}
                colorScheme="blue"
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb boxSize={3} />
              </Slider>

              <Text fontSize="xs" minWidth="40px">
                {formatTime(activeSample.duration)}
              </Text>
            </Flex>
          </Flex>

          {/* Volume control */}
          <Flex gap="2" align="center" width="120px">
            <Tooltip label={player.isMuted ? 'Unmute' : 'Mute'}>
              <IconButton
                aria-label={player.isMuted ? 'Unmute' : 'Mute'}
                icon={player.isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                size="sm"
                variant="ghost"
                onClick={player.toggleMute}
              />
            </Tooltip>

            <Slider
              aria-label="Volume"
              min={0}
              max={1}
              step={0.01}
              value={player.volume}
              onChange={player.setVolume}
              focusThumbOnChange={false}
              colorScheme="blue"
              width="80px"
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb boxSize={3} />
            </Slider>
          </Flex>
        </Flex>
      </Card.Body>
    </Card>
  )
}
