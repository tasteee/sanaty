import { Modal, Button, Flex, Text, Card } from '@mantine/core'
import { $ui } from '#/stores/ui.store'
import { $collections } from '#/stores/collections.store'

export const AddToCollectionModal = () => {
  const isAddToCollectionModalOpen = $ui.isAddToCollectionModalOpen.use()
  const collections = $collections.store.use()
  if (!isAddToCollectionModalOpen) return null
  const close = () => $ui.isAddToCollectionModalOpen.set(false)
  const add = (id) => $collections.addSampleToCollection(id)

  return (
    <Modal opened={true} onClose={close} title="Add to Collection" centered>
      <Flex gap="sm" direction="column">
        {collections.map((collection) => (
          <Card key={collection.id} shadow="sm" p="xs" withBorder>
            <Flex justify="space-between" align="center" pl="sm">
              <Text size="sm">{collection.name}</Text>
              <Button variant="light" size="sm" onClick={() => add(collection.id)}>
                Add
              </Button>
            </Flex>
          </Card>
        ))}
      </Flex>
    </Modal>
  )
}
