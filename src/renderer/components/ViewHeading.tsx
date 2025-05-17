import { CuteIcon } from './ui/CuteIcon'
import { Flex, Title } from '@mantine/core'

export const ViewHeading = (props) => {
  return (
    <Flex gap="xs" mb="sm" mt="md" align="center" className="ViewHeading">
      {props.iconName && <CuteIcon customIcon={props.iconName} size="2xl" />}
      <Title order={2} lh="80%">
        {props.title}
      </Title>
      {props.children}
    </Flex>
  )
}
