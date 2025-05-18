import { Icon } from '#/components'
import { Flex, Title } from '@mantine/core'

export const ViewHeading = (props) => {
  return (
    <Flex gap="xs" mb="sm" mt="md" align="center" className="ViewHeading">
      {props.iconName && <Icon icon={props.iconName} width={36} height={36} />}
      <Title order={2} lh="80%">
        {props.title}
      </Title>
      {props.children}
    </Flex>
  )
}
