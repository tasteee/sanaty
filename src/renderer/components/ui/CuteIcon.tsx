import { Icon } from '@iconify/react'
import { Icon as ChakraIcon } from '@chakra-ui/react'
import clsx from 'clsx'
import React from 'react'

type PropsT = {
  id?: string
  name?: string
  kind?: string
  size?: string
  rotate?: number
  color?: string | any
  className?: string
  isActive?: boolean
  activeColor?: string | any
  style?: React.CSSProperties
  customIcon?: string
  onClick?: any
  zIndex?: any
  isActionable?: boolean
}

export const CuteIcon = React.memo((props: PropsT) => {
  const library = 'mingcute'
  const kind = props.kind || 'line'
  const mingIcon = `${library}:${props.name}-${kind}`
  const icon = props.customIcon || mingIcon
  const color = props.isActive ? props.activeColor : props.color
  const className = clsx('CuteIcon', props.className)
  const style = { ...(props.style || {}), cursor: props.isActionable ? 'pointer' : undefined }

  const innerIconProps = {
    rotate: props.rotate,
    icon
  }

  const outerIconProps = {
    className,
    color,
    style,
    zIndex: props.zIndex,
    onClick: props.onClick,
    id: props.id,
    size: props.size
  }

  return (
    <ChakraIcon {...outerIconProps}>
      <Icon {...innerIconProps} />
    </ChakraIcon>
  )
})
