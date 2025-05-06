import { Icon } from '@iconify/react'

type PropsT = {
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
  onClick?: () => void
}

export const CuteIcon = (props: PropsT) => {
  const { customIcon, ...otherProps } = props

  const library = 'mingcute'
  const kind = props.kind || 'line'
  const width = props.width || props.size || 24
  const height = props.height || props.height || props.size || 24
  const mingIcon = `${library}:${props.name}-${kind}`
  const icon = props.customIcon || mingIcon
  const color = props.isActive ? props.activeColor : props.color

  return <Icon {...otherProps} rotate={props.rotate} color={color} icon={icon} width={width} height={height} />
}
