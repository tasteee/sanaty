import { CuteIcon } from '#/components/ui/CuteIcon'
import { TAGS } from '#/constants'
import { Tag } from '@chakra-ui/react/tag'
import React from 'react'
import { CATEGORY_PALETTES, CATEGORY_ICON_COLORS } from '#/constants/colors'
import { $samplesViewStore } from '../samplesView.store'

type TagCloudTagPropsT = { id: string; isActive: boolean }

export const TagCloudTag = React.memo((props: TagCloudTagPropsT) => {
  const tag = TAGS.MAP[props.id]
  const [colorPalette, iconColor] = getColors(tag, props.isActive)
  const variant = props.isActive ? 'surface' : 'outline'

  const toggleTag = () => {
    $samplesViewStore.toggleFilterTag(tag.id)
  }

  const ActiveChildren = () => {
    return (
      <>
        <Tag.EndElement>
          <CuteIcon name="close-circle" color={iconColor} />
        </Tag.EndElement>
        <Tag.Label className="taggy">{tag.label}</Tag.Label>
      </>
    )
  }

  const InactiveChildren = () => {
    return (
      <>
        <Tag.StartElement>
          <CuteIcon name="add-circle" color={iconColor} />
        </Tag.StartElement>
        <Tag.Label className="taggy">{tag.label}</Tag.Label>
      </>
    )
  }

  return (
    <Tag.Root size="lg" variant={variant} colorPalette={colorPalette} onClick={toggleTag}>
      {props.isActive && <ActiveChildren />}
      {!props.isActive && <InactiveChildren />}
    </Tag.Root>
  )
})

const getColors = (tag: TagT, isActive: boolean) => {
  if (!isActive) return ['gray', '#a1a1aa']
  const colorPalette = CATEGORY_PALETTES[tag.category] || 'gray'
  const iconColor = CATEGORY_ICON_COLORS[tag.category] || '#a1a1aa'
  return [colorPalette, iconColor]
}
