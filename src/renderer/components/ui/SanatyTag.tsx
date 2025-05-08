import { CATEGORY_PALETTES, CATEGORY_ICON_COLORS } from '#/constants/colors'
import { $filters } from '#/stores'
import { Tag } from '@chakra-ui/react/tag'
import clsx from 'clsx'
import { CuteIcon } from './CuteIcon'

type SanatyTagPropsT = {
  id: string
  label: string
  category: string
  size?: string
  variant?: string
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
  const iconColor = props.iconColor || categoryIconColor || '#a1a1aa'
  const colorPalette = props.colorPalette || categoryPalette || 'gray'
  const size = props.size || 'md'
  const variant = props.variant || 'outline'

  return (
    <Tag.Root size={size} colorPalette={colorPalette} variant={variant} className={className} onClick={props.onClick}>
      {props.hasPlusIcon && (
        <Tag.StartElement>
          <CuteIcon name="add-circle" color={iconColor} />
        </Tag.StartElement>
      )}

      <Tag.Label>{props.label}</Tag.Label>

      {props.hasCloseIcon && (
        <Tag.EndElement>
          <CuteIcon name="close-circle" color={iconColor} />
        </Tag.EndElement>
      )}
    </Tag.Root>
  )
}

export const InstrumentTag = (props) => {
  const className = clsx('InstrumentTag', props.className)

  return (
    <SanatyTag
      {...props}
      className={className}
      colorPalette={CATEGORY_PALETTES.instrument}
      iconColor={CATEGORY_ICON_COLORS.instrument}
    />
  )
}

export const GenreTag = (props) => {
  const className = clsx('GenreTag', props.className)

  return (
    <SanatyTag
      {...props}
      className={className}
      colorPalette={CATEGORY_PALETTES.genre}
      iconColor={CATEGORY_ICON_COLORS.genre}
    />
  )
}

export const DescriptorTag = (props) => {
  const className = clsx('DescriptorTag', props.className)

  return (
    <SanatyTag
      {...props}
      className={className}
      colorPalette={CATEGORY_PALETTES.descriptor}
      iconColor={CATEGORY_ICON_COLORS.descriptor}
    />
  )
}
