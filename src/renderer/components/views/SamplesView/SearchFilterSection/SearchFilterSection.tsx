import './SearchFilterSection.css'
import { CuteIcon, Tag, Tabs, Card, Wrap, SegmentGroup, Flex, CloseButton, IconButton, Text, Button } from '#/components'
import { KeySelector } from './KeySelector'
import { ScaleSelector } from './ScaleSelector'
import { BpmRangeController } from './BpmRangeController'
import { SearchInput } from './SearchInput'
import { SampleTypeController } from './SampleTypeController'
import { $samplesViewStore } from '../samplesView.store'
import { TAGS } from '#/constants'
import { ActiveTagFilter, TagCloudTag } from './TagCloudTag'
import React from 'react'
import { useBreakpoints, useElementSize } from '@siberiacancode/reactuse'
import { DurationRangeController } from './DurationRangeController'
import { $collections } from '#/stores/collections'
import { $folders } from '#/stores/folders'

const SearchButton = () => {
  const style = {}

  return (
    <Button colorPalette="pink" size="xs" variant="solid" style={style} onClick={$samplesViewStore.submitSearch}>
      Search
    </Button>
  )
}

export const SearchFilterSection = () => {
  const breakpoints = useBreakpoints({ xs: 0, sm: 700, md: 950, lg: 1080, xl: 1300 })
  const activeBreakpoint = breakpoints.active()

  const TopOptions = () => {
    if (activeBreakpoint === 'lg') {
      return (
        <Flex gap="2" justify="center" direction="column">
          <Flex gap="2" align="center">
            <SearchInput />
            <SampleTypeController />
            <KeySelector />
            <ScaleSelector />
            <LikedFilterSwitch />
            <SearchButton />
          </Flex>

          <Flex gap="2" align="center">
            <BpmRangeController />
            <DurationRangeController />
          </Flex>
        </Flex>
      )
    }

    if (activeBreakpoint === 'md') {
      return (
        <Flex gap="2" justify="center" direction="column">
          <Flex gap="2" align="center">
            <SearchInput />
            <SampleTypeController />
            <LikedFilterSwitch />
            <SearchButton />
          </Flex>

          <Flex gap="2" align="center">
            <KeySelector />
            <ScaleSelector />
          </Flex>
          <Flex gap="2" align="center">
            <BpmRangeController />
            <DurationRangeController />
          </Flex>
        </Flex>
      )
    }

    if (activeBreakpoint === 'sm') {
      return (
        <Flex gap="2" justify="center" direction="column">
          <Flex gap="2" align="center">
            <SearchInput />
            <SampleTypeController />
            <LikedFilterSwitch />
            <SearchButton />
          </Flex>
          <Flex gap="2" align="center">
            <KeySelector />
            <ScaleSelector />
          </Flex>
          <Flex gap="2" align="center">
            <BpmRangeController />
          </Flex>
          <Flex gap="2" align="center">
            <DurationRangeController />
          </Flex>
        </Flex>
      )
    }

    if (activeBreakpoint === 'xs') {
      return (
        <Flex gap="2" justify="center" direction="column">
          <Flex gap="2" align="center">
            <SearchInput />
            <LikedFilterSwitch />
            <SearchButton />
          </Flex>
          <Flex gap="2" align="center">
            <SampleTypeController />
          </Flex>
          <Flex gap="2" align="center">
            <ScaleSelector />
            <KeySelector />
          </Flex>
          <Flex gap="2" align="center">
            <BpmRangeController />
          </Flex>
          <Flex gap="2" align="center">
            <DurationRangeController />
          </Flex>
        </Flex>
      )
    }

    return (
      <Flex gap="2" justify="center" direction="column">
        <Flex gap="2" align="center">
          <SearchInput />
          <SampleTypeController />
          <KeySelector />
          <ScaleSelector />
          <LikedFilterSwitch />
          <SearchButton />
        </Flex>

        <Flex gap="2" align="center">
          <BpmRangeController />
          <DurationRangeController />
        </Flex>
      </Flex>
    )
  }

  return (
    <Card.Root className="SearchFilterSection">
      <Card.Body className="SearchFilterSectionBody" padding="4" gap="2">
        <TopOptions />

        <Flex gap="2">
          <TagsSection />
        </Flex>
      </Card.Body>
    </Card.Root>
  )
}

export const LikedFilterSwitch = (props) => {
  const isActive = $samplesViewStore.filters.use((state) => state.isLiked)
  const iconName = isActive ? 'bxs:heart' : 'bx:heart'
  const color = isActive ? '#ec4899' : '#71717a'
  const colorPalette = isActive ? 'pink' : 'gray'
  const variant = isActive ? 'surface' : 'outline'
  const scale = isActive ? 1.25 : 1.1
  const style = { scale }

  const handleClick = (event) => {
    event.stopPropagation()
    $samplesViewStore.filters.set({ isLiked: !isActive })
  }

  return (
    <IconButton onMouseUp={handleClick} variant={variant} size="xs" colorPalette={colorPalette}>
      <CuteIcon customIcon={iconName} color={color} style={style} />
    </IconButton>
  )
}

const DISPLAY_NONE_STYLE = { display: 'none' }
const EMPTY_STYLE = {}

const TagFilterControl = () => {
  const tagCategoryFilter = $samplesViewStore.activeTagCloudCategory.use()
  const isTagCloudShown = $samplesViewStore.isTagCloudShown.use()
  const style = isTagCloudShown ? EMPTY_STYLE : DISPLAY_NONE_STYLE

  const onChange = (event) => {
    $samplesViewStore.activeTagCloudCategory.set(event.value)
  }

  return (
    <Tabs.Root
      value={tagCategoryFilter}
      variant="outline"
      onValueChange={onChange}
      orientation="vertical"
      style={style}
      mt="2"
    >
      <Tabs.List>
        <Tabs.Trigger value="All">
          <CuteIcon name="earth-2" />
          All
        </Tabs.Trigger>
        <Tabs.Trigger value="Genre" color="purple.500">
          <CuteIcon name="tree" />
          Genres
        </Tabs.Trigger>
        <Tabs.Trigger value="Instrument" color="pink.500">
          <CuteIcon name="guitar" />
          Instruments
        </Tabs.Trigger>
        <Tabs.Trigger value="Descriptor" color="yellow.500">
          <CuteIcon name="tag" />
          Descriptors
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="All">
        <TagCloud />
      </Tabs.Content>
      <Tabs.Content value="Genre">
        <TagCloud />
      </Tabs.Content>
      <Tabs.Content value="Instrument">
        <TagCloud />
      </Tabs.Content>
      <Tabs.Content value="Descriptor">
        <TagCloud />
      </Tabs.Content>
    </Tabs.Root>
  )
}

const TagCloud = React.memo((props) => {
  return (
    <Flex overflowY="scroll" maxH="159px" className="TagCloud customScrollbar" paddingRight="8px">
      <Wrap gap="2">
        {TAGS.LIST.map((tag) => {
          return <TagCloudTag key={tag.id} id={tag.id} />
        })}
      </Wrap>
    </Flex>
  )
})

const TagsSection = () => {
  return (
    <Flex gap="2" direction="column">
      <ActiveTagsSection />
      <TagFilterControl />
    </Flex>
  )
}

const ActiveTagsSection = () => {
  const isTagCloudShown = $samplesViewStore.isTagCloudShown.use()
  const activeTags = $samplesViewStore.filters.use((state) => state.tags)
  const arrowIconName = isTagCloudShown ? 'down-small' : 'right-small'

  return (
    <Wrap gap="2" mt="2">
      <IconButton
        size="2xs"
        variant="subtle"
        className="expanderIconButton"
        onClick={$samplesViewStore.toggleTagCloudVisibility}
      >
        <CuteIcon name={arrowIconName} size={48} className="expanderCaret" />
      </IconButton>

      {!!activeTags.length && <CloseButton size="2xs" variant="subtle" onClick={$samplesViewStore.clearTags} />}
      {!activeTags.length && <NoTagsSelectedText />}

      {activeTags.map((tag) => (
        <ActiveTagFilter key={tag} id={tag} />
      ))}
    </Wrap>
  )
}

const NoTagsSelectedText = () => {
  return (
    <Text textStyle="sm" style={{ lineHeight: '160%', marginLeft: 8 }} color="gray.500">
      No tags selected
    </Text>
  )
}

const tagCloud = <TagCloud />
