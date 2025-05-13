import './TagCloudHeader.css'
import React from 'react'
import { CuteIcon, Tag, Tabs, Card, Em, Wrap, SegmentGroup, Flex, CloseButton, IconButton, Text, Button } from '#/components'
import { KeySelector } from './KeySelector'
import { ScaleSelector } from './ScaleSelector'
import { BpmRangeController } from './BpmRangeController'
import { SearchInput } from './SearchInput'
import { SampleTypeController } from './SampleTypeController'
import { TAGS } from '#/constants'
import { ActiveTagFilter, TagCloudTag } from './TagCloudTag'
import { useBreakpoints } from '@siberiacancode/reactuse'
import { DurationRangeController } from './DurationRangeController'
import { $ui } from '#/stores/ui.store'
import { $search } from '#/stores/search.store'
import clsx from 'clsx'

export const TagCloudHeader = () => {
  return (
    <Flex gap="2">
      <TagsSection />
    </Flex>
  )
}

const DISPLAY_NONE_STYLE = { display: 'none' }
const EMPTY_STYLE = {}

const TagFilterControl = () => {
  const tagCategoryFilter = $ui.activeTagCloudCategory.use()
  const isTagCloudShown = $ui.isTagCloudOpen.use()
  const style = isTagCloudShown ? EMPTY_STYLE : DISPLAY_NONE_STYLE

  const onChange = (event) => {
    $ui.activeTagCloudCategory.set(event.value)
  }

  const tagCloud = React.useMemo(() => {
    return <TagCloud />
  }, [tagCategoryFilter])

  return (
    <Tabs.Root value={tagCategoryFilter} variant="outline" onValueChange={onChange} orientation="vertical" style={style} mt="2">
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
      <Tabs.Content value="All">{tagCloud}</Tabs.Content>
      <Tabs.Content value="Genre">{tagCloud}</Tabs.Content>
      <Tabs.Content value="Instrument">{tagCloud}</Tabs.Content>
      <Tabs.Content value="Descriptor">{tagCloud}</Tabs.Content>
    </Tabs.Root>
  )
}

const TagCloud = (props) => {
  const activeTags = $search.useFilterTags()

  return (
    <Flex overflowY="scroll" maxH="159px" className="TagCloud customScrollbar" paddingRight="8px">
      <Wrap gap="2">
        {TAGS.LIST.map((tag) => {
          return <TagCloudTag key={tag.id} id={tag.id} isActive={activeTags.includes(tag.id)} />
        })}
      </Wrap>
    </Flex>
  )
}

const TagsSection = () => {
  const activeTagCloudCategory = $ui.activeTagCloudCategory.use()
  const className = clsx('TagsSection', `activeTagCategory_${activeTagCloudCategory}`)

  return (
    <Flex gap="2" direction="column" className={className}>
      <ActiveTagsSection />
      <TagFilterControl />
    </Flex>
  )
}

const ActiveTagsSection = () => {
  const isTagCloudShown = $ui.isTagCloudOpen.use()
  const activeTags = $search.filters.use((state) => state.tags)
  const arrowIconName = isTagCloudShown ? 'down-small' : 'right-small'

  return (
    <Wrap gap="2" mt="2">
      <IconButton size="2xs" variant="subtle" className="expanderIconButton" onClick={() => $ui.isTagCloudOpen.set.toggle()}>
        <CuteIcon name={arrowIconName} size="md" className="expanderCaret" />
      </IconButton>

      {!!activeTags.length && <CloseButton size="2xs" variant="subtle" onClick={$search.clearTags} />}
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
      <Em>No tags selected</Em>
    </Text>
  )
}
