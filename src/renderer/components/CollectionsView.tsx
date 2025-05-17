import { $collections } from '#/stores/collections.store'
import { CuteIcon } from '#/components/ui/CuteIcon'
import { $ui } from '#/stores/ui.store'
import { Button, Card, Group, Center, Flex, Text } from '@mantine/core'
import { View } from '#/components/View'
import { ActionIcon } from '@mantine/core'
import { navigateTo } from '#/modules/routing'
import { Icon } from '@iconify/react'

export const CollectionsView = () => {
  const collections = $collections.store.use()

  return (
    <View id="CollectionsView" style={{ overflowY: 'scroll', height: '100vh' }}>
      <View.Heading title="Collections" iconName="mingcute:playlist-2-fill">
        <Button size="xs" variant="default" onClick={() => $ui.isCreateCollectionDialogOpen.set(true)}>
          Create Collection
        </Button>
      </View.Heading>

      <Flex className="collectionsBox" gap="sm" mt="sm">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} {...collection} />
        ))}
      </Flex>
    </View>
  )
}

export const CollectionCard = (props) => {
  const onRemoveClick = () => $collections.delete(props.id)
  const onEditClick = () => $ui.startEditingCollection(props.id)
  const onBrowseClick = () => navigateTo('/collections/collection/' + props.id)

  return (
    <Card withBorder className="CollectionCard" w="300px">
      <Flex direction="column" gap="sm">
        <Group justify="space-between">
          <Text>{props.name}</Text>
        </Group>

        <Text size="sm" c="dimmed" pr="lg">
          {props.sampleIds.length} samples
        </Text>

        <Flex justify="end" gap="md" mt="sm" wrap="nowrap">
          <ActionIcon variant="subtle" c="red" onClick={onRemoveClick}>
            <Icon width={20} height={20} icon="mingcute:delete-2-line" />
          </ActionIcon>
          <ActionIcon variant="subtle" color="gray" onClick={onEditClick}>
            <Icon width={20} height={20} icon="mingcute:edit-2-line" />
          </ActionIcon>
          <ActionIcon variant="subtle" color="gray" onClick={onBrowseClick}>
            <Icon width={20} height={20} icon="mingcute:search-3-line" />
          </ActionIcon>
        </Flex>
      </Flex>
    </Card>
  )
}
