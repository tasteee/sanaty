import './SearchFilterSection.css'
import { CuteIcon, Tag, Tabs, Card, Wrap, SegmentGroup, Flex } from '#/components'
import { $filters } from '#/stores/search.store'
import { KeySelector } from './KeySelector'
import { ScaleSelector } from './ScaleSelector'
import { BpmRangeController } from './BpmRangeController'
import { SearchInput } from './SearchInput'
import { SampleTypeController } from './SampleTypeController'

export const SearchFilterSection = () => {
  return (
    <Card.Root className="SearchFilterSection">
      <Card.Body className="SearchFilterSectionBody" padding="4" gap="5">
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

  const onChange = (event) => {
    $filters.tagCategoryFilter.set(event.value)
  }

  const tagCloud = <TagCloud />

  return (
    <Tabs.Root value={tagCategoryFilter} variant="outline" onValueChange={onChange} orientation="vertical">
      <Tabs.List>
        <Tabs.Trigger value="All">
          <CuteIcon name="earth-2" />
          All
        </Tabs.Trigger>
        <Tabs.Trigger value="Genre">
          <CuteIcon name="tree" />
          Genres
        </Tabs.Trigger>
        <Tabs.Trigger value="Instrument">
          <CuteIcon name="guitar" />
          Instruments
        </Tabs.Trigger>
        <Tabs.Trigger value="Descriptor">
          <CuteIcon name="tag" />
          Descriptors
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="All">{tagCloud}</Tabs.Content>
      <Tabs.Content value="Genre">{tagCloud}</Tabs.Content> <Tabs.Content value="Instrument">{tagCloud}</Tabs.Content>{' '}
      <Tabs.Content value="Descriptor">{tagCloud}</Tabs.Content>
    </Tabs.Root>
  )
}

const FilterOptionTag = (props) => {
  return (
    <Tag.Root size="md" colorPalette="blue">
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
  const [activeTags, categoryTags] = $filters.useTagCloudTags()

  return (
    <Flex overflowY="scroll" maxH="159px" className="customScrollbar">
      <Wrap gap="2">
        <SampleTypeTag />
        <KeyScaleTag />
        <BpmTag />

        {activeTags.map((tag) => (
          <Tag.Root key={tag.id} size="md" colorPalette="pink" onClick={() => $filters.toggleTag(tag.id)}>
            <Tag.Label>{tag.label}</Tag.Label>
            <Tag.EndElement>
              <Tag.CloseTrigger />
            </Tag.EndElement>
          </Tag.Root>
        ))}

        {categoryTags.map((tag) => (
          <Tag.Root size="md" variant="surface" colorPalette="gray" key={tag.id} onClick={() => $filters.toggleTag(tag.id)}>
            <Tag.StartElement>
              <CuteIcon name="add" color="a1a1aa" />
            </Tag.StartElement>
            <Tag.Label>{tag.label}</Tag.Label>
          </Tag.Root>
        ))}
      </Wrap>
    </Flex>
  )
}

const TagsSection = () => {
  return (
    <Flex gap="2">
      <TagFilterControl />
    </Flex>
  )
}
