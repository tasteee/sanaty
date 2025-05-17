import { CATEGORY_PALETTES, CATEGORY_ICON_COLORS } from '#/constants/colors'
import clsx from 'clsx'
import { CuteIcon } from './CuteIcon'
import { Badge, Group } from '@mantine/core'

type SanatyTagPropsT = {
  id: string
  label: string
  category: string
  size?: string
  variant?: string
  color?: string
  iconColor?: string
  colorPalette?: string
  hasCloseIcon?: boolean
  hasPlusIcon?: boolean
  className?: string
  onClick?: () => void
}

export const SanatyTag = (props: SanatyTagPropsT) => {
  const className = clsx('SanatyTag', props.className)
  const categoryPalette = CATEGORY_PALETTES[props.category]
  const categoryIconColor = CATEGORY_ICON_COLORS[props.category]
  const propsColor = props.color || props.colorPalette || 'gray'
  const iconColor = props.iconColor || categoryIconColor || '#a1a1aa'
  const color = propsColor || categoryPalette || 'gray'
  const size = props.size || 'md'
  const variant = props.variant || 'outline'

  const leftSection = props.hasPlusIcon ? <CuteIcon name="add-circle" color={iconColor} /> : null
  const rightSection = props.hasCloseIcon ? <CuteIcon name="close-circle" color={iconColor} /> : null
  return (
    <Badge
      size={size}
      variant={variant}
      className={className}
      color={color}
      onClick={props.onClick}
      rightSection={rightSection}
      leftSection={leftSection}
    >
      {props.label}
    </Badge>
  )
}

export const InstrumentTag = (props) => {
  const className = clsx('InstrumentTag', props.className)

  return (
    <SanatyTag {...props} className={className} colorPalette={CATEGORY_PALETTES.instrument} iconColor={CATEGORY_ICON_COLORS.instrument} />
  )
}

export const GenreTag = (props) => {
  const className = clsx('GenreTag', props.className)

  return <SanatyTag {...props} className={className} colorPalette={CATEGORY_PALETTES.genre} iconColor={CATEGORY_ICON_COLORS.genre} />
}

export const DescriptorTag = (props) => {
  const className = clsx('DescriptorTag', props.className)

  return (
    <SanatyTag {...props} className={className} colorPalette={CATEGORY_PALETTES.descriptor} iconColor={CATEGORY_ICON_COLORS.descriptor} />
  )
}
