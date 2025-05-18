import { $toasts } from '#/stores/toasts.store'
import { SheIcon } from '#/components/CuteIcon'
import { Dialog, Flex, Text } from '@mantine/core'

type ToastPropsT = {
  id: string
  isClosable: boolean
  message: string
  type: string
}

export const Toast = (props: ToastPropsT) => {
  const onClose = () => $toasts.close(props.id)
  const iconColor = props.type === 'success' ? 'green' : 'red'
  const iconName = props.type === 'success' ? 'mingcute:check-circle-fill' : 'mingcute:alert-octagon-fill'

  return (
    <Dialog opened withCloseButton={props.isClosable} onClose={onClose} size="md" radius="md" withBorder>
      <Flex gap="sm">
        <SheIcon icon={iconName} color={iconColor} width={24} height={24} />
        <Text size="sm" mb="xs">
          {props.message}
        </Text>
      </Flex>
    </Dialog>
  )
}

export const Toasts = () => {
  const toasts = $toasts.list.use()
  return toasts.map((toast) => <Toast {...toast} />)
}
