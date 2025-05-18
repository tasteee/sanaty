import { Icon as IconifyIcon } from '@iconify/react'
import clsx from 'clsx'

type PropsT = {
  id?: string
  icon: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  width?: number
  height?: number
  rotation?: number
  color?: string | any
  className?: string
  style?: React.CSSProperties
}

const SIZE_MAP = {
  xs: [16, 16],
  sm: [20, 20],
  md: [24, 24],
  lg: [28, 28],
  xl: [32, 32]
}

const getWidthHeight = (props: PropsT) => {
  const [sizeWidth, sizeHeight] = SIZE_MAP[props.size] || []
  const width = props.width || sizeWidth || 24
  const height = props.height || sizeHeight || 24
  return { width, height }
}

export const SheIcon = (props: PropsT) => {
  const { size, className, rotation, ...otherProps } = props
  const sizes = getWidthHeight(props)
  const classNames = clsx('SheIcon', className)
  return <IconifyIcon className={classNames} {...otherProps} {...sizes} />
}
