import classes from 'clsx'
import { useLocation } from 'wouter'
import { $sidebar } from '#/stores/sidebar.stoe'
import { Flex, HStack, Text, Circle } from '#/components'

export const MenuItem = (props) => {
  const [, setLocation] = useLocation()
  const weight = props.isActive ? 'light' : 'light'
  const className = classes('MenuItem', props.isActive && 'isActive', props.className)

  const onClick = () => {
    $sidebar.activeMenuItemId.set(props.id)
    setLocation(props.route)
  }

  return (
    <Flex
      className={className}
      justify="space-between"
      onClick={onClick}
      position="relative"
      align="center"
      style={props.style}
    >
      <Text fontWeight={weight}>{props.label}</Text>
      {props.children}
    </Flex>
  )
}

// const ActiveMenuItemIndicator = () => {
//   return <Circle size="1" bg="#db2777" color="white" className="ActiveMenuItemIndicator" />
// }
