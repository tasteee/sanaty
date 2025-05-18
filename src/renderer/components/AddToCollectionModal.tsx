import { Modal, Button, Flex, Text, Card } from '@mantine/core'
import { $collections } from '#/stores/collections.store'

type PropsT = {
  sampleId: string
  onClose: () => void
}

export const AddToCollectionModal = (props: PropsT) => {
  const collections = $collections.store.use()

  const add = (collectionId) => {
    $collections.addSampleToCollection(collectionId, props.sampleId)
    props.onClose()
  }

  return (
    <Modal opened onClose={props.onClose} title="Add to collection" centered>
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
