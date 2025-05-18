import React from 'react'
import { _tags } from '#/modules/tags'
import { Flex } from '@mantine/core'
import { SanatyTag } from './SanatyTag'

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
  const overviewTags = getLimitedCategorizedTags(props.tags || [], 2)

  return (
    <Flex w="100%" className="AssetTagsOverview">
      <Flex w="100%" gap="sm">
        {overviewTags.map((tag: TagT) => (
          <SanatyTag key={tag.id} size="sm" id={tag.id} label={tag.label} category={tag.category} className="AssetTagsOverviewTag" />
        ))}
      </Flex>
    </Flex>
  )
})
