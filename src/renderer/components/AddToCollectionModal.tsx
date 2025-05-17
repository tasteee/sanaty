import { Modal, Button, Flex, Text } from '@mantine/core'
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
          <Flex p="xs" justify="space-between" key={collection.id}>
            <Text size="sm">{collection.name}</Text>
            <Button variant="light" size="sm" onClick={() => add(collection.id)}>
              Add
            </Button>
          </Flex>
        ))}
      </Flex>
    </Modal>
  )
}
