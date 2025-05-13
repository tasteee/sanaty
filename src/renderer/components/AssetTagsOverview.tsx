import { _tags } from '#/modules/tags'
import React from 'react'
import { Flex } from '@chakra-ui/react/flex'
import { SanatyTag } from './ui/SanatyTag'
import { HoverCard, Menu, Portal, Wrap } from '#/components'
import { PLACEMENTS } from '#/constants'
import { useToggle } from '@siberiacancode/reactuse'

type PropsT = {
  tags: string[]
}

const getCategorizedTags = (tags: string[]) => {
  const tagObjects = tags.map(_tags.getTagObjectById)
  const categorizedTags = _tags.categorizeTags(tagObjects)
  return categorizedTags
}

const getLimitedCategorizedTags = (tags: string[], limit: number) => {
  const categorizedTags = getCategorizedTags(tags)
  const genre = categorizedTags.genre.slice(0, 1)
  const instrument = categorizedTags.instrument.slice(0, 1)
  const descriptor = categorizedTags.descriptor.slice(0, 1)
  return [...genre, ...instrument, ...descriptor]
}

export const AssetTagsOverview = React.memo((props: PropsT) => {
  const overviewTags = getLimitedCategorizedTags(props.tags, 2)
  const [isOpen, toggleOpen] = useToggle()
  const handleOpenChange = (event) => toggleOpen(event.open)

  const fullTagsList = React.useMemo(() => {
    return <AssetTagsFullList overviewTags={overviewTags} tags={props.tags} />
  }, [])

  return (
    <Flex width="100%" truncate className="AssetTagsOverview">
      <HoverCard.Root positioning={PLACEMENTS.BOTTOM_START} openDelay={500} onOpenChange={handleOpenChange}>
        <HoverCard.Trigger asChild>
          <Flex truncate width="100%" gap="2">
            {overviewTags.map((tag: TagT) => (
              <SanatyTag key={tag.id} size="sm" id={tag.id} label={tag.label} category={tag.category} className="AssetTagsOverviewTag" />
            ))}
          </Flex>
        </HoverCard.Trigger>
        <Portal>
          <HoverCard.Positioner>
            <HoverCard.Content className="hoverCardContent" as={Flex}>
              {isOpen && fullTagsList}
            </HoverCard.Content>
          </HoverCard.Positioner>
        </Portal>
      </HoverCard.Root>
    </Flex>
  )
})

const AssetTagsFullList = (props) => {
  const allTags = getLimitedCategorizedTags(props.tags, 20)

  return (
    <Wrap gap="2">
      {allTags.map((tag: TagT) => {
        if (props.overviewTags.includes(tag)) return null

        return <SanatyTag key={tag.id} size="sm" id={tag.id} label={tag.label} category={tag.category} className="AssetTagsOverviewTag" />
      })}
    </Wrap>
  )
}
