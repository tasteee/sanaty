import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React from 'react'

type PropsT = {
  id?: string
  name?: string
  kind?: string
  size?: number
  width?: number
  height?: number
  rotate?: number
  color?: string
  className?: string
  isActive?: boolean
  activeColor?: string
  style?: React.CSSProperties
  customIcon?: string
  onClick?: any
}

export const CuteIcon = React.memo((props: PropsT) => {
  const { customIcon, ...otherProps } = props

  const library = 'mingcute'
  const kind = props.kind || 'line'
  const width = props.width || props.size || 24
  const height = props.height || props.height || props.size || 24
  const mingIcon = `${library}:${props.name}-${kind}`
  const icon = props.customIcon || mingIcon
  const color = props.isActive ? props.activeColor : props.color
  const className = clsx('CuteIcon', props.className)

  return (
    <Icon
      {...otherProps}
      className={className}
      rotate={props.rotate}
      color={color}
      icon={icon}
      width={width}
      height={height}
    />
  )
})
