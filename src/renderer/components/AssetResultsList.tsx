import './AssetResultsList.css'
import React from 'react'
import { useEffect } from 'react'
import { ResultsPaginator } from './ResultsPaginator'
import { Flex, Text } from '@mantine/core'
import { Card } from '#/components'
import { SortOptionsRow } from './SortOptionsRow'
import { Menu } from '@mantine/core'
import { SanatyTag } from './SanatyTag'
import { $ui } from '#/stores/ui.store'
import { $likes } from '#/stores/likes.store'
import { motion } from 'framer-motion'
import { $search } from '#/stores/search.store'
import { useDeferredRender } from '#/modules/hooks'
import { activeStyles, ACTIVE_BG_GRADIENT } from '#/styles/objects'
import { KeyboardNavigationProvider } from '#/components/KeyboardNavigationProvider'
import { Icon } from '@iconify/react'
import { $playback } from '#/stores/playback.store'
import clsx from 'clsx'
import { useModalState } from '#/modules/useModalState'
import { AddToCollectionModal } from './AddToCollectionModal'

function loadInitialSampleResults() {
  const entityType = $ui.routeEntityType.state
  const entityId = $ui.routeEntityId.state
  const filterKey = entityType === 'collection' ? 'collectionId' : 'folderId'

  $playback.reset()
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
    const container = document.querySelector('.SampleResultsList') as any
    if (container) container.focus()

    // If no active asset is set and we have results, prepare for keyboard navigation
    const currentActiveIndex = $playback.activeAssetIndex.state

    if (currentActiveIndex === -1) {
      // Don't auto-activate the first item, but prepare for down arrow press
      // This follows the behavior where down arrow first activates item 0
    }
  }, [isReady, pageResults])

  return (
    <KeyboardNavigationProvider>
      <Flex className="SampleResultsList" direction="column" pb="24px" tabIndex={0} gap="md" h="100%" style={{ overflow: 'hidden' }}>
        <SortOptionsRow />

        <Flex gap="md" direction="column" justify="space-between" h="96%" className="mainResultsArea" pb="sm">
          <Flex className="AssetResultsList customScrollbar" direction="column" gap="sm" p="sm" h="100%" style={{ overflow: 'auto' }}>
            {isReady &&
              pageResults.map((sample, index) => {
                // Calculate the actual index in the full results array
                const currentPage = $search.pagination.state.currentPage
                const itemsPerPage = $search.pagination.state.itemsPerPage
                const globalIndex = (currentPage - 1) * itemsPerPage + index
                return <AssetRow key={sample.id} id={sample.id} index={index} globalIndex={globalIndex} />
              })}
          </Flex>

          {pageResults.length > 0 && <ResultsPaginator />}
        </Flex>
      </Flex>
    </KeyboardNavigationProvider>
  )
}

type AssetRowPropsT = {
  id: string
  index: number
  globalIndex: number
}

const useSampleData = (id) => {
  const sampleResult = $search.useSampleResult(id) || {}
  const isLiked = $likes.useIsLiked(id)
  const { key, scale, ...otherData } = sampleResult
  const sample = { id, isLiked, ...otherData }
  return sample
}

export const AssetRow = (props: AssetRowPropsT) => {
  const isBeingAddedToCollection = false
  const isActive = $search.useIsSampleActive(props.id)
  const sample = useSampleData(props.id)
  const beforeStyles = isActive ? activeStyles : {}
  const bgGradient = isActive ? ACTIVE_BG_GRADIENT : ''
  const beingAddedClassName = isBeingAddedToCollection ? 'sampleBeingAdded' : ''
  const className = clsx('AssetRow', isActive && 'activeRow', beingAddedClassName)

  const activateAssetRow = (event) => {
    if (event.button === 2) return
    AssetOpenLocationButton
    const isOpener = event.target.closest('.AssetOpenLocationButton') !== null
    const isLiker = event.target.closest('.AssetLikeToggler') !== null
    const isLeftColumn = event.target.closest('.leftColumn') !== null
    const isInsideHoverCard = event.target.closest('.hoverCardContent') !== null
    if (isInsideHoverCard || isLeftColumn || isLiker || isOpener) return
    if (isActive) return
    $playback.playSample(sample, props.globalIndex)
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
          <Flex align="center" gap="sm">
            <LeftColumn {...sample} isActive={isActive} />
            <MiddleColumn {...sample} isActive={isActive} />
            <RightColumn {...sample} isActive={isActive} />
          </Flex>
        </Card.Body>
      </Card.Root>
    </motion.div>
  )
}

const MiddleColumn = (props) => {
  return (
    <Flex direction="column" flex="1" gap="1" justify="center" className="middleColumn">
      <Flex gap="md" align="center" className="topRow">
        <AssetName name={props.name} />
        <Flex fz="sm" gap="sm">
          <AssetKeyScale tonic={props.tonic} scale={props.scale} />
          <AssetBpm bpm={props.bpm} />
          <AssetDuration duration={props.duration} />
        </Flex>
      </Flex>
      <Flex gap="1" className="bottomRow">
        {/* <AssetTagsOverview tags={props.tags} /> */}
      </Flex>
    </Flex>
  )
}

const RightColumn = (props) => {
  const onClick = (event) => {
    event.stopPropagation()
  }

  return (
    <Flex gap="md" align="flex-end" ml="md">
      <AssetLikeToggler {...props} />
      <AddToCollectionButton {...props} />
      <AssetOpenLocationButton {...props} />
      <AssetCopyButton {...props} />
      {/* <AssetOptionsMenu {...props} /> */}
    </Flex>
  )
}

const AssetOpenLocationButton = (props) => {
  const onOpenClick = (event) => {
    event.stopPropagation()
    window.electron.openExplorerAtFolder(props.folderId)
  }

  return <Icon className="AssetOpenLocationButton" color="gray" icon="majesticons:open-line" width={24} height={24} onClick={onOpenClick} />
}

const AssetCopyButton = (props) => {
  const onDragStart = (event) => {
    event.preventDefault()
    $ui.isDragging.set(true)
    // Important: set effectAllowed to make the drag operation work
    event.dataTransfer.effectAllowed = 'copyMove'
    event.dataTransfer.setData('text/plain', props.path)
    window.electron.startDrag(props.path)
  }

  const onDragEnd = () => {
    $ui.isDragging.set(false)
  }

  return (
    <Flex
      onMouseUp={onDragEnd}
      onDragEnd={onDragEnd}
      onDrop={onDragEnd}
      onDragStart={onDragStart}
      draggable={true}
      className="AssetCopyButton"
    >
      <ActionableIcon width={28} height={28} icon="iconoir:drag-hand-gesture" color="gray" />
    </Flex>
  )
}
export const AssetOptionsMenu = () => {
  return (
    <Menu trigger="hover" openDelay={100} closeDelay={350}>
      <Menu.Target>
        <Icon width={24} height={24} color="gray" icon="mingcute:more-3-line" />
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item>Add to Collection</Menu.Item>
        <Menu.Item>Like</Menu.Item>
        <Menu.Item>Copy</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}

const AddToCollectionButton = (props) => {
  const addModalState = useModalState()

  const handleClick = (event) => {
    event.stopPropagation()
    addModalState.toggleOpen()
  }

  return (
    <>
      <ActionableIcon width={24} height={24} icon="si:add-square-line" color="gray" onClick={handleClick} />
      {addModalState.isOpen && <AddToCollectionModal sampleId={props.id} onClose={addModalState.toggleOpen} />}
    </>
  )
}

const AssetLikeToggler = (props) => {
  const iconName = props.isLiked ? 'bxs:heart' : 'bx:heart'
  const color = props.isLiked ? '#ec4899' : '#71717a'
  const scale = props.isLiked ? 1.05 : 1.0
  const style = { scale }

  const handleClick = (event) => {
    event.stopPropagation()
    $likes.toggle(props.id)
  }

  return (
    <ActionableIcon className="AssetLikeToggler" width={24} height={24} icon={iconName} color={color} onClick={handleClick} style={style} />
  )
}

const ActionableIcon = (props) => {
  const { hoverColor, size, isDisabled, ...otherProps } = props
  const width = props.width || size || 20
  const height = props.height || props.width || size || 20
  const cursorStyle = isDisabled ? '' : 'pointer'
  const iconColor = { '--iconColor': props.color || 'gray' }
  const iconHoverColor = { '--iconHoverColor': hoverColor || 'white' }
  const colorStyles = { ...iconColor, ...iconHoverColor }
  const style = { cursor: cursorStyle, ...colorStyles, ...(props.style || {}) }
  const className = clsx('ActionableIcon', props.className)

  return (
    <Icon
      {...otherProps}
      className={className}
      width={width}
      height={height}
      icon={props.icon}
      onClick={props.onClick}
      style={style}
      onDragStart={props.onDragStart}
    />
  )
}

const LeftColumn = (props) => {
  const isSoundPlaying = $playback.isPlayingSound.use()
  const isThisSamplePlaying = props.isActive && isSoundPlaying
  const iconName = isThisSamplePlaying ? 'mingcute:pause-fill' : 'mingcute:play-line'
  const className = clsx('leftColumn')

  const handleClick = (event) => {
    event.stopPropagation()
    isThisSamplePlaying ? $playback.pausePlayback() : $playback.playSample(props, props.globalIndex)
  }

  return (
    <Flex className={className} onClick={handleClick}>
      <Flex
        className="assetRowArtworkBox"
        bg="gray"
        w="40px"
        h="40px"
        display="flex"
        align="center"
        justify="center"
        style={{ flexShrink: 0, borderRadius: 8 }}
      >
        <Flex className="iconBackdrop" h="100%">
          <ActionableIcon width={20} height={20} icon={iconName} color="white" className="assetRowPlayPauseIcon" />
        </Flex>
      </Flex>
    </Flex>
  )
}

const AssetName = (props) => {
  return (
    <Text fw="bold" size="sm" truncate style={{ maxWidth: 250 }}>
      {props.name}
    </Text>
  )
}

const AssetKeyScale = (props) => {
  return (
    <Flex gap="1">
      <Text size="sm">
        {props.tonic} {props.scale}
      </Text>
    </Flex>
  )
}

const AssetBpm = (props) => {
  return <Text size="sm">{props.bpm}bpm</Text>
}

const AssetDuration = (props) => {
  return <Text size="sm">{props.duration}s</Text>
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
