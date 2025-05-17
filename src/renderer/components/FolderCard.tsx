import { Card, Group, Button, Text, Flex } from '@mantine/core'
import { ActionIcon } from '@mantine/core'
import { CuteIcon } from '#/components'
import { $folders } from '#/stores/folders.store'
import { navigateTo } from '#/modules/routing'

export const FolderCard = (props) => {
  const onRemoveClick = () => $folders.remove(props.id)
  const onRefreshClick = () => $folders.refresh(props.id)
  const onBrowseClick = () => navigateTo('/folders/folder/' + props.id)
  const onOpenClick = () => window.electron.openExplorerAtPath(props.path)

  return (
    <Card withBorder className="FolderCard" w="300px">
      <Flex direction="column" gap="sm">
        <Group justify="space-between">
          <Text>{props.name}</Text>
          <ActionIcon variant="subtle" c="red" onClick={onRemoveClick}>
            <CuteIcon name="delete-2" />
          </ActionIcon>
        </Group>

        <Text size="sm" c="dimmed" truncate="start" pr="lg">
          {props.path}
        </Text>

        <Text size="sm" c="dimmed" pr="lg">
          {props.sampleCount} samples
        </Text>

        <Flex justify="end" gap="md" mt="sm" wrap="nowrap">
          <ActionIcon variant="subtle" color="gray" onClick={onOpenClick}>
            <CuteIcon customIcon="majesticons:open-line" />
          </ActionIcon>

          <ActionIcon variant="subtle" color="gray" onClick={onRefreshClick}>
            <CuteIcon name="refresh-1" />
          </ActionIcon>

          <ActionIcon variant="subtle" color="gray" onClick={onBrowseClick}>
            <CuteIcon name="search-3" />
          </ActionIcon>
        </Flex>
      </Flex>
    </Card>
  )
}
