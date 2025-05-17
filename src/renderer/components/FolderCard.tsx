import { ActionIcon, Card, Group, Button, Tooltip, Text, Flex } from '@mantine/core'
import { $folders } from '#/stores/folders.store'
import { navigateTo } from '#/modules/routing'
import { Icon } from '@iconify/react'

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
        </Group>

        <Text size="sm" c="dimmed" pr="lg">
          {props.sampleCount} samples
        </Text>

        <Tooltip label={props.path} position="bottom">
          <Text size="sm" c="dimmed" truncate="start" pr="lg">
            {props.path}
          </Text>
        </Tooltip>

        <Flex justify="end" gap="md" mt="sm" wrap="nowrap">
          <ActionIcon variant="subtle" c="red" onClick={onRemoveClick}>
            <Icon width={20} height={20} icon="mingcute:delete-2-line" />
          </ActionIcon>
          <ActionIcon variant="subtle" color="gray" onClick={onRefreshClick}>
            <Icon width={20} height={20} icon="mingcute:refresh-1-line" />
          </ActionIcon>
          <ActionIcon variant="subtle" color="gray" onClick={onOpenClick}>
            <Icon width={20} height={20} icon="majesticons:open-line" />
          </ActionIcon>
          <ActionIcon variant="subtle" color="gray" onClick={onBrowseClick}>
            <Icon width={20} height={20} icon="mingcute:search-3-line" />
          </ActionIcon>
        </Flex>
      </Flex>
    </Card>
  )
}
