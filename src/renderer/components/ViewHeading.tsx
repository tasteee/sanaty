import { Flex } from '@chakra-ui/react/flex'
import { Heading } from '@chakra-ui/react/typography'
import { CuteIcon } from './ui/CuteIcon'

export const ViewHeading = (props) => {
  return (
    <Flex gap="4" mb="2" align="center" className="ViewHeading">
      <CuteIcon customIcon={props.iconName} size="xl" style={{ marginTop: 2 }} />
      <Heading size="3xl">{props.title}</Heading>
      {props.children}
    </Flex>
  )
}
