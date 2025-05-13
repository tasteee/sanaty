import { useEffect } from 'react'
import './AssetResultsList.css'
import { Paginator } from './Paginator'
import { Box, Flex, IconButton, Text, CuteIcon } from '#/components'
import { Card } from '#/components'
import { SortOptionsRow } from '../SearchFilterSection/SortOptionsRow'
import { AssetRowOptionsMenu } from './AssetRowOptionsMenu'
import { SanatyTag } from '../../../ui/SanatyTag'
import { AssetTagsOverview } from '../../../AssetTagsOverview'
import { $ui } from '#/stores/ui.store'
import { $likes } from '#/stores/likes.store'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { Clipboard } from '@chakra-ui/react'
import { $search } from '#/stores/search.store'
import { useDeferredRender } from '#/modules/hooks'
import { activeStyles, ACTIVE_BG_GRADIENT } from '#/styles/objects'
import { KeyboardNavigationProvider } from '#/components/KeyboardNavigationProvider'
import React from 'react'

function loadInitialSampleResults() {
  console.log('loadInitialSampleResults')
  const entityType = $ui.routeEntityType.state
  const entityId = $ui.routeEntityId.state
  const filterKey = entityType === 'collection' ? 'collectionId' : 'folderId'

  $ui.setActiveSampleIndex(-1)
  $ui.setActiveSampleId('')
  $search.filters.set.reset()
  $search.results.set.reset()
  $search.pagination.set.reset()
  $search.filters.set({ [filterKey]: entityId })
  $search.searchSamples()
}

export const SampleResultsList = () => {
  const routeEntityType = $ui.routeEntityType.use()
  const routeEntityId = $ui.routeEntityId.use()
  const pageResults = $search.usePageResults()
  const isReady = useDeferredRender(pageResults)

  React.useEffect(() => {
    loadInitialSampleResults()
  }, [routeEntityId, routeEntityType])

  // Effect to initialize keyboard focus when results load
  useEffect(() => {
    if (!isReady || pageResults.length < 1) return

    // Set focus to the container to enable keyboard navigation
    const container = document.querySelector('.SampleResultsList')
    if (container) container.focus()

    // If no active asset is set and we have results, prepare for keyboard navigation
    const currentActiveIndex = $ui.activeAssetIndex.state

    if (currentActiveIndex === -1) {
      // Don't auto-activate the first item, but prepare for down arrow press
      // This follows the behavior where down arrow first activates item 0
    }
  }, [isReady, pageResults])

  return (
    <KeyboardNavigationProvider>
      <Flex className="SampleResultsList" direction="column" overflow="hidden" pb="24px" tabIndex="0" gap="1" height="100%">
        <SortOptionsRow />

        <Flex gap="2" direction="column" justify="space-between" height="95%" className="mainResultsArea">
          <Flex className="AssetResultsList customScrollbar" direction="column" gap="2" padding="2" overflowY="auto" height="100%">
            {isReady &&
              pageResults.map((sample, index) => {
                // Calculate the actual index in the full results array
                const currentPage = $search.pagination.state.currentPage
                const itemsPerPage = $search.pagination.state.itemsPerPage
                const globalIndex = (currentPage - 1) * itemsPerPage + index

                return <AssetRow key={sample.id} id={sample.id} index={globalIndex} />
              })}
          </Flex>

          {pageResults.length > 0 && <Paginator />}
        </Flex>
      </Flex>
    </KeyboardNavigationProvider>
  )
}

type AssetRowPropsT = {
  id: string
  index: number
}

const useSampleData = (id) => {
  const sampleResult = $search.useSampleResult(id) || {}
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
  const beingAddedClassName = isBeingAddedToCollection ? 'sampleBeingAdded' : ''
  const className = clsx('AssetRow', isActive && 'activeRow', beingAddedClassName)

  const activateAssetRow = (event) => {
    const isInsideHoverCard = event.target.closest('.hoverCardContent') !== null
    if (isInsideHoverCard) return
    $ui.setActiveSampleIndex(props.index)
    $ui.setActiveSampleId(props.id)
    $ui.isPlayingSound.set(true)
    // Simulate audio completion after duration
    const duration = sample.duration * 1000 // Convert to milliseconds
    setTimeout(() => {
      $ui.isPlayingSound.set(false)
    }, duration || 3000) // Default to 3 seconds
  }

  return (
    <motion.div
      initial={{ opacity: 0, translateX: -5, translateY: -5 }}
      animate={{ opacity: 1, translateX: 0, translateY: 0 }}
      transition={{ duration: 0.5, delay: props.index * 0.05 }} // Reduced delay for better performance
    >
      <Card.Root
        data-sampleid={props.id}
        className={className}
        size="sm"
        borderRadius="lg"
        position="relative"
        style={{ background: 'none', border: 'none', boxShadow: 'none', padding: 0 }}
        _before={beforeStyles}
        onMouseUp={activateAssetRow}
      >
        <Card.Body zIndex={1} position="relative" bgGradient={bgGradient} className="AssetRowBody">
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
      <AssetRowOptionsMenu {...props} />
    </Flex>
  )
}

const useIsAddingSampleToCollection = (id) => {
  const isAddingToCollection = $ui.isAddingToCollection.use()
  const addingSampleId = $ui.collectionAdditionSampleId.use()
  const isThisAssetBeingAdded = isAddingToCollection && addingSampleId === id
  return isThisAssetBeingAdded
}

const AddToCollectionButton = (props) => {
  const isBeingAddedToCollection = useIsAddingSampleToCollection(props.id)
  const color = isBeingAddedToCollection ? 'orange.400' : 'gray.400'
  const iconName = isBeingAddedToCollection ? 'raphael:no' : 'si:add-square-line'

  const handleClick = (event) => {
    event.stopPropagation()
    if (isBeingAddedToCollection) console.log('is already being added...')
    if (isBeingAddedToCollection) return $ui.turnAddToCollectionModeOff()
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
