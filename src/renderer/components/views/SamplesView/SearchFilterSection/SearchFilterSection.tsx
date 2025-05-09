import './SearchFilterSection.css'
import { CuteIcon, Tag, Tabs, Card, Wrap, SegmentGroup, Flex, CloseButton, IconButton, Text } from '#/components'
import { KeySelector } from './KeySelector'
import { ScaleSelector } from './ScaleSelector'
import { BpmRangeController } from './BpmRangeController'
import { SearchInput } from './SearchInput'
import { SampleTypeController } from './SampleTypeController'
import { $samplesViewStore } from '../samplesView.store'
import { TAGS } from '#/constants'
import { TagCloudTag } from './TagCloudTag'

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
      <Tabs.Content value="All">{tagCloud}</Tabs.Content>
      <Tabs.Content value="Genre">{tagCloud}</Tabs.Content>
      <Tabs.Content value="Instrument">{tagCloud}</Tabs.Content>
      <Tabs.Content value="Descriptor">{tagCloud}</Tabs.Content>
    </Tabs.Root>
  )
}

const TagCloud = () => {
  const activeTags = $samplesViewStore.filters.use((state) => state.tags)
  const category = $samplesViewStore.activeTagCloudCategory.use()

  return (
    <Flex overflowY="scroll" maxH="159px" className="TagCloud customScrollbar" paddingRight="8px">
      <Wrap gap="2">
        {TAGS.LIST.map((tag) => {
          const shouldRender = checkShouldRenderTag(tag, category)
          if (!shouldRender) return null
          if (activeTags.includes(tag.id)) return null
          return <TagCloudTag key={tag.id} id={tag.id} isActive={false} />
        })}
      </Wrap>
    </Flex>
  )
}

const checkShouldRenderTag = (tag: TagT, activeCategory: string) => {
  if (activeCategory === 'All') return true
  if (activeCategory.toLowerCase() === tag.category) return true
  return false
}

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
        <TagCloudTag key={tag} id={tag} isActive />
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
