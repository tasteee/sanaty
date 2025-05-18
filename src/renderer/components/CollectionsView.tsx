import { $collections } from '#/stores/collections.store'
import { Button, Card, Group, Flex, Text } from '@mantine/core'
import { View } from '#/components/View'
import { ActionIcon } from '@mantine/core'
import { navigateTo } from '#/modules/routing'
import { CreateCollectionDialog, EditCollectionDialog } from './CollectionDialogs'
import { useModalState } from '#/modules/useModalState'
import { SheIcon } from '#/components/@she/SheIcon'

export const CollectionsView = () => {
  const createModalState = useModalState()
  const collections = $collections.store.use()

  return (
    <View id="CollectionsView" style={{ overflowY: 'scroll', height: '100vh' }}>
      <View.Heading title="Collections" iconName="mingcute:playlist-2-fill">
        <Button size="xs" variant="default" onClick={createModalState.toggleOpen}>
          Create Collection
        </Button>
      </View.Heading>

      <Flex className="collectionsBox" gap="sm" mt="sm">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} {...collection} />
        ))}
      </Flex>

      {createModalState.isOpen && <CreateCollectionDialog onClose={createModalState.toggleOpen} />}
    </View>
  )
}

export const CollectionCard = (props) => {
  const editModalState = useModalState()
  const onRemoveClick = () => $collections.delete(props.id)
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
            <SheIcon width={20} height={20} icon="mingcute:delete-2-line" />
          </ActionIcon>
          <ActionIcon variant="subtle" color="gray" onClick={editModalState.toggleOpen}>
            <SheIcon width={20} height={20} icon="mingcute:edit-2-line" />
          </ActionIcon>
          <ActionIcon variant="subtle" color="gray" onClick={onBrowseClick}>
            <SheIcon width={20} height={20} icon="mingcute:search-3-line" />
          </ActionIcon>
        </Flex>
      </Flex>

      {editModalState.isOpen && <EditCollectionDialog {...props} onClose={editModalState.toggleOpen} />}
    </Card>
  )
}
