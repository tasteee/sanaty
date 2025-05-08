import './SearchFilterSection.css'
import { CuteIcon, Tag, Tabs, Card, Wrap, SegmentGroup, Flex, CloseButton, IconButton, Text } from '#/components'
import { $filters } from '#/stores/search.store'
import { KeySelector } from './KeySelector'
import { ScaleSelector } from './ScaleSelector'
import { BpmRangeController } from './BpmRangeController'
import { SearchInput } from './SearchInput'
import { SampleTypeController } from './SampleTypeController'
import React from 'react'
import { $main } from '#/stores/main'

// TODO: On mount, ensure filters / tags / sorts are all reset.
// TODO: When filter / tags / sorts change, fetch matching samples from the database.
// TODO: When viewing a collection, make sure to filter the samples by collection.sampleIds.

export const SearchFilterSection = () => {
  return (
    <Card.Root className="SearchFilterSection">
      <Card.Body className="SearchFilterSectionBody" padding="4" gap="2">
        <Flex gap="2" align="center">
          <SearchInput />
          <SampleTypeController />
          <KeySelector />
          <ScaleSelector />
          <BpmRangeController />
        </Flex>
        <Flex gap="2">
          <TagsSection />
        </Flex>
      </Card.Body>
    </Card.Root>
  )
}

const TagFilterControl = () => {
  const tagCategoryFilter = $filters.tagCategoryFilter.use()
  const isTagCloudShown = $main.isTagCloudShown.use()
  const style = isTagCloudShown ? {} : { display: 'none' }

  const onChange = (event) => {
    $filters.tagCategoryFilter.set(event.value)
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
      <Tabs.Content value="All">{tagCloud}</Tabs.Content>
      <Tabs.Content value="Genre">{tagCloud}</Tabs.Content>
      <Tabs.Content value="Instrument">{tagCloud}</Tabs.Content>
      <Tabs.Content value="Descriptor">{tagCloud}</Tabs.Content>
    </Tabs.Root>
  )
}

const FilterOptionTag = (props) => {
  return (
    <Tag.Root size="lg" colorPalette="blue">
      <Tag.Label>{props.children}</Tag.Label>
    </Tag.Root>
  )
}

const SampleTypeTag = () => {
  const sampleType = $filters.sampleType.use()
  return <FilterOptionTag>type: {sampleType.label.toLowerCase()}</FilterOptionTag>
}

const BpmTag = () => {
  const bpmRange = $filters.bpmRange.use()
  const minBpm = bpmRange[0]
  const maxBpm = bpmRange[1]
  return (
    <FilterOptionTag>
      bpm: {minBpm}-{maxBpm}
    </FilterOptionTag>
  )
}

const KeyScaleTag = () => {
  const key = $filters.key.use()
  const scale = $filters.scale.use()

  const isKeyAny = key.value === 'any'
  const isScaleAny = scale.value === 'any'

  const keyText = isKeyAny ? 'any key' : `key: ${key.label.toLowerCase()}`
  const scaleText = isScaleAny ? 'any scale' : `scale: ${scale.label.toLowerCase()}`

  return (
    <>
      <FilterOptionTag>{keyText}</FilterOptionTag>
      <FilterOptionTag>{scaleText}</FilterOptionTag>
    </>
  )
}

const TagCloud = () => {
  // TODO: Add conditional rendering of tags based on watching
  // the category filter here.
  const categoryTags = $filters.useTagCloudTags()

  return (
    <Flex overflowY="scroll" maxH="159px" className="customScrollbar" paddingRight="8px">
      <Wrap gap="2">
        {/* {activeTags.map((tag) => (
          <ActiveTagCloudTag key={tag._id} id={tag._id} label={tag._id} />
        ))} */}

        {categoryTags.map((tag) => (
          <TagCloudTag key={tag._id} id={tag._id} label={tag._id} category={tag.category} />
        ))}
      </Wrap>
    </Flex>
  )
}

type TagCloudTagPropsT = { id: string; label: string; category?: string }

const ActiveTagCloudTag = React.memo((props: TagCloudTagPropsT) => {
  const colorPalette = CATEGORY_PALETTES[props.category] || 'gray'
  const iconColor = CATEGORY_ICON_COLORS[props.category] || '#a1a1aa'

  return (
    <Tag.Root variant="surface" size="lg" colorPalette={colorPalette} onClick={() => $filters.toggleTag(props._id)}>
      <Tag.Label className="taggy">{props.label}</Tag.Label>
      <Tag.EndElement>
        <CuteIcon name="close-circle" color={iconColor} />
      </Tag.EndElement>
    </Tag.Root>
  )
})

const CATEGORY_PALETTES = {
  instrument: 'pink',
  genre: 'purple',
  descriptor: 'yellow'
}

const CATEGORY_ICON_COLORS = {
  instrument: '#f9a8d4',
  genre: '#d8b4fe',
  descriptor: '#fde047'
}

export const TagCloudTag = React.memo((props: TagCloudTagPropsT) => {
  // const colorPalette = CATEGORY_PALETTES[props.category] || 'gray'
  // const iconColor = CATEGORY_ICON_COLORS[props.category] || '#a1a1aa'
  const colorPalette = 'gray'
  const iconColor = '#a1a1aa'

  return (
    <Tag.Root size="lg" variant="outline" colorPalette={colorPalette} onClick={() => $filters.toggleTag(props._id)}>
      <Tag.StartElement>
        <CuteIcon name="add-circle" color={iconColor} />
      </Tag.StartElement>
      <Tag.Label className="taggy">{props.label}</Tag.Label>
    </Tag.Root>
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
  const isTagCloudShown = $main.isTagCloudShown.use()
  const activeTags = $filters.useActiveTags()
  const mb = activeTags.length ? '2' : '0'
  const arrowIconName = isTagCloudShown ? 'down-small' : 'right-small'

  return (
    <Wrap gap="2" mt="2">
      {/* <SampleTypeTag />
      <KeyScaleTag />
      <BpmTag /> */}
      <IconButton
        className="expanderIconButton"
        size="2xs"
        variant="subtle"
        onClick={() => $main.isTagCloudShown.set.toggle()}
      >
        <CuteIcon name={arrowIconName} size={48} className="expanderCaret" />
      </IconButton>

      {!!activeTags.length && (
        <>
          <CloseButton size="2xs" variant="subtle" onClick={() => $filters.tags.set([])} />
        </>
      )}

      {!activeTags.length && (
        <Text textStyle="sm" style={{ lineHeight: '160%', marginLeft: 8 }} color="gray.500">
          No tags selected
        </Text>
      )}

      {activeTags.map((tag) => (
        <ActiveTagCloudTag key={tag._id} id={tag._id} label={tag._id} category={tag.category} />
      ))}
    </Wrap>
  )
}

const tagCloud = <TagCloud />
