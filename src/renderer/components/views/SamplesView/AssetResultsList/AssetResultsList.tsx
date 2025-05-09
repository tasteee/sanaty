import React from 'react'
import { datass } from 'datass'
import { Box, Flex, Portal, IconButton, Text, Tag, Menu, CuteIcon, Popover } from '#/components'
import { Card } from '#/components'
import { useActiveElement } from '@siberiacancode/reactuse'
import { SortOptionsRow } from '../SearchFilterSection/SortOptionsRow'
import { AssetRowOptionsMenu } from './AssetRowOptionsMenu'
import { SanatyTag } from '../../../ui/SanatyTag'

import { useUnmount } from '@siberiacancode/reactuse'
import { AssetTagsOverview } from '../../../AssetTagsOverview'
import { $samplesViewStore } from '../samplesView.store'

const $sampleResults = datass.array([])
const $activeRowIndex = datass.number(-1)

const handleArrowKeys = (event: KeyboardEvent) => {
  const isPrevious = event.code === 'KeyQ'
  const isNext = event.code === 'KeyW'

  const previousIndex = $activeRowIndex.state - 1
  const nextIndex = $activeRowIndex.state + 1

  const maxIndex = $samplesViewStore.results.state.length - 1
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

const ACTIVE_BG_GRADIENT = 'linear-gradient(to right, #18181b, transparent)'

export const AssetRow = React.memo((props: AssetRowPropsT) => {
  const sample = $samplesViewStore.useAssetResult(props.id)
  const beforeStyles = props.isActive ? activeStyles : {}
  const bgGradient = props.isActive ? ACTIVE_BG_GRADIENT : ''

  React.useEffect(() => {
    if (!props.isActive) return
    $samplesViewStore.activeSample.set(sample)
  }, [props.isActive])

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
          <LeftColumn {...sample} />
          <MiddleColumn {...sample} />
          <RightColumn {...sample} />
        </Flex>
      </Card.Body>
    </Card.Root>
  )
})

const MiddleColumn = (props) => {
  return (
    <Flex direction="column" flex="1" gap="1" justify="center" className="middleColumn">
      <Flex gap="4" align="center" cassName="topRow">
        <AssetName name={props.name} />
        <Flex fontSize="sm" color="gray.500" gap="4">
          <AssetKeyScale key={props.key} scale={props.scale} />
          <AssetBpm bpm={props.bpm} />
          <AssetDuration duration={props.duration} />
        </Flex>
      </Flex>
      <Flex gap="1" className="bottomRow">
        <AssetTagsOverview tags={props.tags} />
      </Flex>
    </Flex>
  )
}

const RightColumn = (props) => {
  return (
    <Flex gap="2" align="flex-end" ml="2">
      <AssetLikeToggler id={props._id} isLiked={props.isLiked} />
      <AssetRowOptionsMenu />
    </Flex>
  )
}

const AssetLikeToggler = (props) => {
  const iconName = props.isLiked ? 'bxs:heart' : 'bx:heart'
  const color = props.isLiked ? '#ec4899' : '#71717a'
  const scale = props.isLiked ? 1.25 : 1.1
  const style = { scale }

  const handleClick = (event) => {
    event.stopPropagation()
    $samplesViewStore.toggleSampleLiked(props.id)
  }

  return (
    <IconButton onMouseUp={handleClick} variant="plain">
      <CuteIcon customIcon={iconName} color={color} style={style} />
    </IconButton>
  )
}

export const AssetLikedFilterSwitch = (props) => {
  const iconName = props.isLiked ? 'bxs:heart' : 'bx:heart'
  const color = props.isLiked ? '#ec4899' : '#71717a'
  const scale = props.isLiked ? 1.25 : 1.1
  const style = { scale }

  const handleClick = (event) => {
    event.stopPropagation()
  }

  return (
    <IconButton onMouseUp={handleClick} variant="outline">
      <CuteIcon customIcon={iconName} color={color} style={style} />
    </IconButton>
  )
}

const LeftColumn = (props) => {
  return (
    <Flex className="leftColumn">
      {props.isActive && <AssetRowPlaybackController />}
      {!props.isActive && <AssetRowLeftBox />}
    </Flex>
  )
}

const AssetName = (props) => {
  return <Text fontWeight="bold">{props.name}</Text>
}

const AssetKeyScale = (props) => {
  return (
    <Flex gap="1">
      <Text>{props.key}</Text>
      <Text>{props.scale}</Text>
    </Flex>
  )
}

const AssetBpm = (props) => {
  return <Text>{props.bpm}bpm</Text>
}

const AssetDuration = (props) => {
  return <Text>{props.duration}s</Text>
}

export const AssetRowTag = (props) => {
  const handleClick = () => {
    $samplesViewStore.toggleFilterTag(props.id)
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
