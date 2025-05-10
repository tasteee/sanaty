import React from 'react'
import { Paginator } from './Paginator'
import { Box, Flex, Portal, IconButton, Text, Tag, Menu, CuteIcon, Popover } from '#/components'
import { Card } from '#/components'
import { useActiveElement } from '@siberiacancode/reactuse'
import { SortOptionsRow } from '../SearchFilterSection/SortOptionsRow'
import { AssetRowOptionsMenu } from './AssetRowOptionsMenu'
import { SanatyTag } from '../../../ui/SanatyTag'
import capitalize from 'capitalize'

import { useUnmount } from '@siberiacancode/reactuse'
import { AssetTagsOverview } from '../../../AssetTagsOverview'
import { $samplesViewStore } from '../samplesView.store'
import { $main } from '#/stores/main'
import { $folders } from '#/stores/folders'
import { $likes } from '#/stores/likes'
import clsx from 'clsx'

const handleArrowKeys = (event: KeyboardEvent) => {
  const isPrevious = event.code === 'KeyQ'
  const isNext = event.code === 'KeyW'

  const previousIndex = $samplesViewStore.activeAssetIndex.state - 1
  const nextIndex = $samplesViewStore.activeAssetIndex.state + 1

  const maxIndex = $samplesViewStore.results.state.length - 1
  const minIndex = 0

  const finalPreviousIndex = Math.max(minIndex, previousIndex)
  const finalNextIndex = Math.min(maxIndex, nextIndex)

  if (isPrevious) $samplesViewStore.activeAssetIndex.set(finalPreviousIndex)
  if (isNext) $samplesViewStore.activeAssetIndex.set(finalNextIndex)
}

export const SampleResultsList = () => {
  const sampleResults = $samplesViewStore.currentPageResults.use()

  return (
    <Flex direction="column" flex="1" overflow="hidden" pb="24px" tabIndex="0" gap="1">
      <SortOptionsRow />

      <Flex className="AssetResultsList customScrollbar" direction="column" gap="2" padding="2" overflowY="auto" flex="1">
        {sampleResults.map((sample, index) => {
          return <AssetRow key={sample._id} id={sample._id} index={index} />
        })}
      </Flex>

      {sampleResults.length > 0 && <Paginator />}
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
  index: number
}

const ACTIVE_BG_GRADIENT = 'linear-gradient(to right, #18181b, transparent)'

const getKeyScale = (sample) => {
  if (!sample) {
    const results = $samplesViewStore.results.state
    const pageResults = $samplesViewStore.currentPageResults.state
    debugger
  }

  const key = sample.key.toUpperCase()
  const scale = capitalize.words(sample.scale)
  return `${key} ${scale}`
}

const useSampleData = (id) => {
  const sampleResult = $samplesViewStore.useAssetResult(id)
  const keyScale = getKeyScale(sampleResult)
  const isLiked = $likes.useIsLiked(id)
  const { key, scale, ...otherData } = sampleResult
  const sample = { id, keyScale, isLiked, ...otherData }
  return sample
}

export const AssetRow = (props: AssetRowPropsT) => {
  const isActive = $samplesViewStore.useIsSampleActive(props.id)
  const sample = useSampleData(props.id)
  const beforeStyles = isActive ? activeStyles : {}
  const bgGradient = isActive ? ACTIVE_BG_GRADIENT : ''
  const isCompactView = $main.isCompactViewEnabled.use()
  const bodyPadding = isCompactView ? '0' : undefined

  const activateAssetRow = (event) => {
    const isInsideHoverCard = event.target.closest('.hoverCardContent') !== null
    console.log('activateeee', props.id)
    if (isInsideHoverCard) return
    $samplesViewStore.activeSample.set(sample)
    $samplesViewStore.activeAssetIndex.set(props.index)
  }

  // TODO: On play click
  // TODO: play/pause icon based on $main.isPlayingSound.use()
  // TODO: show 2 tags from each category.
  // TODO: truncate tags.
  // TODO: hover to show all tags.

  const className = clsx('AssetRow', isActive && 'activeRow')

  return (
    <Card.Root
      className={className}
      size="sm"
      borderRadius="lg"
      position="relative"
      style={{ background: 'none', border: 'none', boxShadow: 'none', padding: 0 }}
      _before={beforeStyles}
      onMouseUp={activateAssetRow}
    >
      <Card.Body zIndex={1} position="relative" bgGradient={bgGradient} padding={bodyPadding} className="AssetRowBody">
        <Flex align="center" gap="4">
          <LeftColumn {...sample} isActive={isActive} />
          <MiddleColumn {...sample} isActive={isActive} />
          <RightColumn {...sample} isActive={isActive} />
        </Flex>
      </Card.Body>
    </Card.Root>
  )
}

const MiddleColumn = (props) => {
  return (
    <Flex direction="column" flex="1" gap="1" justify="center" className="middleColumn">
      <Flex gap="4" align="center" cassName="topRow">
        <AssetName name={props.name} />
        <Flex fontSize="sm" color="gray.500" gap="4">
          <AssetKeyScale keyScale={props.keyScale} />
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

import { Clipboard } from '@chakra-ui/react'

const RightColumn = (props) => {
  const onClick = (event) => {
    event.stopPropagation()
    console.log('clickeddd')
  }

  return (
    <Flex gap="2" align="flex-end" ml="2">
      <AssetLikeToggler {...props} />
      <Clipboard.Root value="https://chakra-ui.com" onMouseUp={onClick}>
        <Clipboard.Trigger asChild>
          <IconButton variant="plain" size="xs">
            <Clipboard.Indicator style={{ scale: 1.25, position: 'relative', bottom: 4 }} />
          </IconButton>
        </Clipboard.Trigger>
      </Clipboard.Root>
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
    console.log('liking ', props.name)
    $likes.toggleLike(props.id)
  }

  return (
    <IconButton onMouseUp={handleClick} variant="plain">
      <CuteIcon customIcon={iconName} color={color} style={style} />
    </IconButton>
  )
}

const LeftColumn = (props) => {
  const artworkUrl = $folders.getFolderArtwork(props.folderId)
  const isSoundPlaying = $samplesViewStore.isPlayingSound.use()
  const isThisSamplePlaying = props.isActive && isSoundPlaying
  const iconName = isThisSamplePlaying ? 'pause' : 'play'
  const className = clsx('leftColumn')

  return (
    <Flex className={className}>
      <Box
        className="assetRowArtworkBox"
        bg="gray.600"
        boxSize="40px"
        borderRadius="md"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexShrink={0}
        style={{ background: `url(${artworkUrl})`, backgroundSize: 'cover' }}
      >
        <div className="iconBackdrop">
          <CuteIcon name={iconName} className="assetRowPlayPauseIcon" />
        </div>
      </Box>
    </Flex>
  )
}

const AssetName = (props) => {
  return (
    <Text fontWeight="bold" textStyle="sm" maxWidth="350px" truncate>
      {props.name}
    </Text>
  )
}

const AssetKeyScale = (props) => {
  return (
    <Flex gap="1">
      <Text>{props.keyScale}</Text>
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
