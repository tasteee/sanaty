import './AssetResultsList.css'
import { Paginator } from './Paginator'
import { Box, Flex, Portal, IconButton, Text, Tag, Menu, CuteIcon, Popover } from '#/components'
import { Card } from '#/components'
import { SortOptionsRow } from '../SearchFilterSection/SortOptionsRow'
import { AssetRowOptionsMenu } from './AssetRowOptionsMenu'
import { SanatyTag } from '../../../ui/SanatyTag'
import capitalize from 'capitalize'
import { AssetTagsOverview } from '../../../AssetTagsOverview'
import { $ui } from '#/stores/ui.store'
import { $likes } from '#/stores/likes.store'
import clsx from 'clsx'
import { motion } from 'framer-motion'

export const SampleResultsList = () => {
  const pageResults = $search.usePageResults()
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    if (!pageResults.length) return
    setTimeout(() => {
      setReady(true)
    }, 250)
  }, [pageResults])

  return (
    <Flex className="SampleResultsList" direction="column" overflow="hidden" pb="24px" tabIndex="0" gap="1" height="100%">
      <SortOptionsRow />

      <Flex gap="2" direction="column" justify="space-between" height="95%" className="mainResultsArea">
        <Flex className="AssetResultsList customScrollbar" direction="column" gap="2" padding="2" overflowY="auto" height="100%">
          {ready &&
            pageResults.map((sample, index) => {
              return <AssetRow key={sample.id} id={sample.id} index={index} />
            })}
        </Flex>

        {pageResults.length > 0 && <Paginator />}
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
  index: number
}

const ACTIVE_BG_GRADIENT = 'linear-gradient(to right, #18181b, transparent)'

const useSampleData = (id) => {
  const sampleResult = $search.useSampleResult(id)
  const isLiked = $likes.useIsLiked(id)
  const { key, scale, ...otherData } = sampleResult
  const sample = { id, isLiked, ...otherData }
  return sample
}

export const AssetRow = (props: AssetRowPropsT) => {
  const isBeingAddedToCollection = useIsAddingSampleToCollection(props.id)
  const isActive = $search.useIsSampleActive(props.id)
  const sample = useSampleData(props.id)
  const beforeStyles = isActive ? activeStyles : {}
  const bgGradient = isActive ? ACTIVE_BG_GRADIENT : ''
  const isCompactView = $ui.isCompactViewEnabled.use()
  const bodyPadding = isCompactView ? '0' : undefined

  const activateAssetRow = (event) => {
    const isInsideHoverCard = event.target.closest('.hoverCardContent') !== null
    if (isInsideHoverCard) return
    $ui.activeAssetIndex.set(props.index)
  }

  // TODO: On play click
  // TODO: play/pause icon based on $ui.isPlayingSound.use()
  // TODO: show 2 tags from each category.
  // TODO: truncate tags.
  // TODO: hover to show all tags.

  const beingAddedClassName = isBeingAddedToCollection ? 'sampleBeingAdded' : ''
  const className = clsx('AssetRow', isActive && 'activeRow', beingAddedClassName)

  return (
    <motion.div
      initial={{ opacity: 0, translateX: -5, translateY: -5 }}
      animate={{ opacity: 1, translateX: 0, translateY: 0 }}
      transition={{ duration: 0.5, delay: props.index * 0.1 }}
    >
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
            <RightColumn {...sample} isActive={isActive} isBeingAddedToCollection={isBeingAddedToCollection} />
          </Flex>
        </Card.Body>
      </Card.Root>
    </motion.div>
  )
}

const MiddleColumn = (props) => {
  return (
    <Flex direction="column" flex="1" gap="1" justify="center" className="middleColumn">
      <Flex gap="4" align="center" cassName="topRow">
        <AssetName name={props.name} />
        <Flex fontSize="sm" color="gray.500" gap="4">
          <AssetKeyScale tonic={props.tonic} scale={props.scale} />
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
import { $search } from '#/stores/search.store'
import React from 'react'

const RightColumn = (props) => {
  const onClick = (event) => {
    event.stopPropagation()
  }

  return (
    <Flex gap="2" align="flex-end" ml="2">
      <AssetLikeToggler {...props} />

      <AddToCollectionButton {...props} />

      <Clipboard.Root value="TODO" onMouseUp={onClick}>
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

const useIsAddingSampleToCollection = (id) => {
  const isAddingToCollection = $ui.isAddingToCollection.use()
  const addingSampleId = $ui.collectionAdditionSampleId.use()
  const isThisAssetBeingAdded = isAddingToCollection && addingSampleId === id
  // console.log({ isAddingToCollection, addingSampleId, isThisAssetBeingAdded })
  return isThisAssetBeingAdded
}

const AddToCollectionButton = (props) => {
  const isBeingAddedToCollection = useIsAddingSampleToCollection(props.id)
  const color = isBeingAddedToCollection ? 'orange.400' : 'gray.400'
  const iconName = isBeingAddedToCollection ? 'raphael:no' : 'si:add-square-line'
  if (isBeingAddedToCollection) console.log('AND NOW ITS BEING ADDED', props.id)
  // const iconName = isAddingAssetToCollection ? 'bxs:heart' : 'bx:heart'
  // const color = isAddingAssetToCollection ? '#ec4899' : '#71717a'
  // const scale = isAddingAssetToCollection ? 1.25 : 1.1
  // const style = { scale }

  const handleClick = (event) => {
    event.stopPropagation()
    console.log('clicked to add to collection', props.id)
    if (isBeingAddedToCollection) console.log('is already being added...')
    if (isBeingAddedToCollection) return $ui.turnAddToCollectionModeOff()
    console.log('turning on add to collection', props.id)
    $ui.turnAddToCollectionModeOn(props.id)
  }

  return (
    <IconButton onMouseUp={handleClick} variant="plain">
      <CuteIcon customIcon={iconName} color={color} />
    </IconButton>
  )
}

const AssetLikeToggler = (props) => {
  const iconName = props.isLiked ? 'bxs:heart' : 'bx:heart'
  const color = props.isLiked ? '#ec4899' : '#71717a'
  const scale = props.isLiked ? 1.25 : 1.1
  const style = { scale }

  const handleClick = (event) => {
    event.stopPropagation()
    $likes.toggle(props.id)
  }

  return (
    <IconButton onMouseUp={handleClick} variant="plain">
      <CuteIcon customIcon={iconName} color={color} style={style} />
    </IconButton>
  )
}

const LeftColumn = (props) => {
  const artworkUrl = 'https://placehold.co/400'
  const isSoundPlaying = $ui.isPlayingSound.use()
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
        <Flex className="iconBackdrop" height="100%">
          <CuteIcon name={iconName} className="assetRowPlayPauseIcon" />
        </Flex>
      </Box>
    </Flex>
  )
}

const AssetName = (props) => {
  return (
    <Text fontWeight="bold" textStyle="sm" maxWidth="250px" truncate>
      {props.name}
    </Text>
  )
}

const AssetKeyScale = (props) => {
  return (
    <Flex gap="1">
      <Text>
        {props.tonic} {props.scale}
      </Text>
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
    $search.toggleTag(props.id)
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
