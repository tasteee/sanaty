import React from 'react'
import { datass } from 'datass'
import { Box, Flex, Portal, IconButton, Text, Tag, Menu, CuteIcon, Popover } from '#/components'
import { Card } from '#/components'
import { $samples } from '#/stores/samples'
import { useActiveElement } from '@siberiacancode/reactuse'
import { SortOptionsRow } from '../SearchFilterSection/SortOptionsRow'
import { $filters } from '#/stores'
import { AssetRowOptionsMenu } from './AssetRowOptionsMenu'
import { SanatyTag } from '../ui/SanatyTag'

import { useUnmount } from '@siberiacancode/reactuse'

const $sampleResults = datass.array([])
const $activeRowIndex = datass.number(-1)

const handleArrowKeys = (event: KeyboardEvent) => {
  const isPrevious = event.code === 'KeyQ'
  const isNext = event.code === 'KeyW'

  const previousIndex = $activeRowIndex.state - 1
  const nextIndex = $activeRowIndex.state + 1

  const maxIndex = $samples.list.state.length - 1
  const minIndex = 0

  const finalPreviousIndex = Math.max(minIndex, previousIndex)
  const finalNextIndex = Math.min(maxIndex, nextIndex)

  if (isPrevious) $activeRowIndex.set(finalPreviousIndex)
  if (isNext) $activeRowIndex.set(finalNextIndex)
}

export const SampleResultsList = () => {
  const activeRowIndex = $activeRowIndex.use()
  const sampleResults = $sampleResults.use()
  const activeElement = useActiveElement()
  const ref = React.useRef(null)

  useUnmount(() => {
    $sampleResults.set.reset()
    $activeRowIndex.set.reset()
  })

  // when results list container is te active element, handle arrow keys
  // when it is not, do not handle arrow keys
  React.useEffect(() => {
    if (!ref || !activeElement) return
    if (ref.current === activeElement) console.log('adding events...')
    if (ref.current === activeElement) window.addEventListener('keydown', handleArrowKeys)
    if (ref.current !== activeElement) window.removeEventListener('keydown', handleArrowKeys)
  }, [ref.current, activeElement])

  React.useEffect(() => {
    $samples.getSomeSamples()
  }, [])

  return (
    <Flex direction="column" flex="1" overflow="hidden" pb="24px" ref={ref} tabIndex="0">
      <SortOptionsRow />

      <Flex className="AssetResultsList customScrollbar" direction="column" gap="2" padding="2" overflowY="auto" flex="1">
        {sampleResults.map((sample, index) => {
          return <AssetRow key={sample._id} id={sample._id} index={index} isActive={activeRowIndex === index} />
        })}
      </Flex>
    </Flex>
  )
}

const activeStyles = {
  content: '""',
  position: 'absolute',
  top: '-3px',
  bottom: '-3px',
  left: '-3px',
  right: '-3px',
  bgGradient: `linear-gradient(to right, #2c0514, transparent)`,
  borderRadius: 'lg',
  zIndex: 0,
  border: '1px solid #ec4899'
}

type AssetRowPropsT = {
  id: string
  isActive: boolean
  index: number
}

const AssetRowPlaybackController = (props) => {
  const iconName = true ? 'play' : 'pause'

  return (
    <AssetRowLeftBox>
      <CuteIcon name={iconName} />
    </AssetRowLeftBox>
  )
}

const AssetRowLeftBox = (props) => {
  return (
    <Box
      bg="gray.600"
      boxSize="40px"
      borderRadius="md"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
      {...props}
    />
  )
}

const BG_GRADIENT = 'linear-gradient(to right, #18181b, transparent)'

const nikedIcon = <CuteIcon customIcon="bxs:heart" color="#ec4899" style={{ scale: 1.25 }} />
const notLikedIcon = <CuteIcon customIcon="bx:heart" color="#71717a" style={{ scale: 1.1 }} />

export const AssetRow = React.memo((props: AssetRowPropsT) => {
  const sample = $samples.useSample(props.id)
  const beforeStyles = props.isActive ? activeStyles : {}
  const bgGradient = props.isActive ? BG_GRADIENT : ''
  const heartIcon = sample.isLiked ? nikedIcon : notLikedIcon

  React.useEffect(() => {
    if (!props.isActive) return
    $samples.activeSample.set(sample)
  }, [props.isActive])

  const toggleAssetLiked = (event) => {
    event.stopPropagation()
    $samples.toggleSampleLiked(props.id)
  }

  const activateAssetRow = (event) => {
    const isInsideHoverCard = event.target.closest('.hoverCardContent') !== null
    if (isInsideHoverCard) return
    $activeRowIndex.set(props.index)
  }

  // TODO: On play click
  // TODO: play/pause icon based on $main.isPlayingSound.use()
  // TODO: show 2 tags from each category.
  // TODO: truncate tags.
  // TODO: hover to show all tags.

  return (
    <Card.Root
      className="AssetRow"
      size="sm"
      borderRadius="lg"
      position="relative"
      _before={beforeStyles}
      onMouseUp={activateAssetRow}
    >
      <Card.Body zIndex={1} position="relative" bgGradient={bgGradient}>
        <Flex align="center" gap="4">
          {props.isActive && <AssetRowPlaybackController />}
          {!props.isActive && <AssetRowLeftBox />}

          <Flex direction="column" flex="1" justify="center">
            <Flex gap="4" align="center">
              <Text fontWeight="bold">{sample.name}</Text>
              <Flex fontSize="sm" color="gray.500" gap="4">
                <Flex gap="1">
                  <Text>{sample.key}</Text>
                  <Text>{sample.scale}</Text>
                </Flex>
                <Text>{sample.bpm} BPM</Text>
                <Text>{sample.duration}s</Text>
              </Flex>
            </Flex>
            <Flex mt="1" gap="1">
              <Tag.Root size="md" colorPalette="gray">
                <Tag.Label>808</Tag.Label>
              </Tag.Root>

              <Tag.Root size="md" colorPalette="gray">
                <Tag.Label>Acoustic</Tag.Label>
              </Tag.Root>

              <Tag.Root size="md" colorPalette="gray">
                <Tag.Label>Loop</Tag.Label>
              </Tag.Root>
            </Flex>
          </Flex>

          <Flex gap="2" align="flex-end" ml="2">
            <IconButton onMouseUp={toggleAssetLiked} variant="plain">
              {heartIcon}
            </IconButton>

            {/* <Menu.Root>
              <Menu.Trigger>
                <IconButton variant="outline">
                  <CuteIcon name="more-3" />
                </IconButton>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <Menu.Item value="settings" onClick={handleSettingsClick}>
                      Settings
                    </Menu.Item>
                    <Menu.Item value="support">Support</Menu.Item>
                    <Menu.Item value="addFolder">Add Folder</Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root> */}
            <AssetRowOptionsMenu />
          </Flex>
        </Flex>
      </Card.Body>
    </Card.Root>
  )
})

export const AssetRowTag = (props) => {
  const handleClick = () => {
    $filters.toggleTag(props.id)
  }

  return (
    <SanatyTag
      id={props.id}
      size="md"
      label={props.label}
      variant="outline"
      className="AssetRowTag"
      category={props.category}
      onClick={handleClick}
      hasPlusIcon
    />
  )
}
