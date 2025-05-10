import { CuteIcon } from '#/components/ui/CuteIcon'
import { TAGS } from '#/constants'
import { Tag } from '@chakra-ui/react/tag'
import React from 'react'
import { CATEGORY_PALETTES, CATEGORY_ICON_COLORS } from '#/constants/colors'
import { $samplesViewStore } from '../samplesView.store'
import { $main } from '#/stores/main'
import clsx from 'clsx'
// import './TagCloudTag.css'

type TagCloudTagPropsT = { id: string; className?: string }

const useIsCategoryActive = (tagCategory) => {
  const filter = (value) => value.toLowerCase() === 'all' || value.toLowerCase() === tagCategory
  const isCategoryActive = $samplesViewStore.activeTagCloudCategory.use(filter)
  return isCategoryActive
}

export const TagCloudTag = React.memo((props: TagCloudTagPropsT) => {
  const tag = TAGS.MAP[props.id]
  const isCategoryActive = useIsCategoryActive(tag.category)
  const isActive = $samplesViewStore.filters.use((state) => state.tags.includes(tag.id))
  const shouldHide = isActive || !isCategoryActive
  const isCompactView = $main.isCompactViewEnabled.use()
  const size = isCompactView ? 'sm' : 'lg'
  const className = clsx('TagCloudTag', props.className, shouldHide && 'hiddenTag')

  return (
    <AssetTag
      id={props.id}
      size={size}
      className={className}
      colorPalette="gray"
      iconColor="#a1a1aa"
      variant="outline"
      isActive={false}
      label={tag.label}
    />
  )
})

export const ActiveTagFilter = (props) => {
  const tag = TAGS.MAP[props.id]
  const [colorPalette, iconColor] = getColors(tag)
  const isCompactView = $main.isCompactViewEnabled.use()
  const size = isCompactView ? 'sm' : 'lg'
  const className = clsx('ActiveTagFilter', props.className)

  return (
    <AssetTag
      isActive
      id={props.id}
      size={size}
      colorPalette={colorPalette}
      iconColor={iconColor}
      variant="surface"
      className={className}
      {...tag}
    />
  )
}

type AssetTagPropsT = TagCloudTagPropsT & {
  variant: string
  colorPalette: string
  iconColor: string
  label: string
  className?: string
  isActive?: boolean
  size?: string
}

const AssetTag = React.memo((props: AssetTagPropsT) => {
  const className = clsx('AssetTag', props.className)

  const toggleTag = () => {
    $samplesViewStore.toggleFilterTag(props.id)
  }

  const ActiveChildren = () => {
    return (
      <>
        <Tag.Label className="taggy">{props.label}</Tag.Label>
        <Tag.EndElement display="flex" justify="center" align="center">
          <CuteIcon className="activeTagCloser" name="close-circle" color={props.iconColor} />
        </Tag.EndElement>
      </>
    )
  }

  const InactiveChildren = () => {
    return (
      <>
        <Tag.StartElement display="flex" justify="center" align="center">
          <CuteIcon className="inactiveTagAdder" name="add-circle" color={props.iconColor} />
        </Tag.StartElement>
        <Tag.Label className="taggy">{props.label}</Tag.Label>
      </>
    )
  }

  return (
    <Tag.Root
      className={className}
      size={props.size || 'lg'}
      variant={props.variant}
      colorPalette={props.colorPalette}
      onClick={toggleTag}
      align="center"
    >
      {props.isActive && <ActiveChildren />}
      {!props.isActive && <InactiveChildren />}
    </Tag.Root>
  )
})

const getColors = (tag: TagT) => {
  const colorPalette = CATEGORY_PALETTES[tag.category] || 'gray'
  const iconColor = CATEGORY_ICON_COLORS[tag.category] || '#a1a1aa'
  return [colorPalette, iconColor]
}
