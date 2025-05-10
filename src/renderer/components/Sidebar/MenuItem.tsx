import classes from 'clsx'
import { Flex, HStack, Text, Circle, CuteIcon } from '#/components'

type PropsT = {
  id: string
  className?: string
  label: string
  children?: any
  style?: any
  onClick?: any
  customIconName?: string
  iconName?: string
  iconColor?: any
  iconStyle?: any
  isActive?: boolean
}

export const MenuItem = (props: PropsT) => {
  const className = classes('MenuItem', props.isActive && 'isActive', props.className)
  const style = { ...props.style }

  return (
    <Flex
      className={className}
      justify="space-between"
      onClick={props.onClick}
      position="relative"
      align="center"
      style={style}
    >
      <Flex gap="2" align="center">
        {props.iconName && (
          <CuteIcon
            name={props.iconName}
            customIcon={props.customIconName}
            color={props.iconColor || '#71717a'}
            style={props.iconStyle}
          />
        )}
        <Text maxWidth="170px" truncate>
          {props.label}
        </Text>
      </Flex>
      {props.children}
    </Flex>
  )
}
