import { $collections } from '#/stores/collections.store'
import { Button, ButtonGroup, EmptyState, VStack } from '@chakra-ui/react'
import { CuteIcon } from '#/components/ui/CuteIcon'
import { $ui } from '#/stores/ui.store'
import { Wrap } from '#/components'
import { Center, Flex, Text } from '@mantine/core'
import { View } from '#/components/View'
import { Card, Group } from '@mantine/core'
import { ActionIcon } from '@mantine/core'
import { navigateTo } from '#/modules/routing'

export const NoCollectionsView = () => {
  return (
    <Flex direction="column" flex="1" justify="center">
      <EmptyState.Root>
        <EmptyState.Content>
          <EmptyState.Indicator>
            <CuteIcon name="sad" size="2xl" />
          </EmptyState.Indicator>
          <VStack textAlign="center">
            <EmptyState.Title>Create your first collection</EmptyState.Title>
            <EmptyState.Description>Without any collections, this page won't be very useful.</EmptyState.Description>
          </VStack>
          <ButtonGroup>
            <Button onClick={() => $ui.isCreateCollectionDialogOpen.set(true)}>Create Collection</Button>
          </ButtonGroup>
        </EmptyState.Content>
      </EmptyState.Root>
    </Flex>
  )
}

export const CollectionsView = () => {
  const collections = $collections.store.use()

  return (
    <View id="CollectionsView" style={{ overflowY: 'scroll', height: '100vh' }}>
      <View.Heading title="Collections" iconName="mingcute:playlist-2-fill" />
      <Wrap className="collectionsBox" gap="6">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} {...collection} />
        ))}
      </Wrap>
    </View>
  )
}

export const CollectionCard = (props) => {
  const onRemoveClick = () => $collections.delete(props.id)
  const onEditClick = () => {}
  const onBrowseClick = () => navigateTo('/collections/collection/' + props.id)

  return (
    <Card withBorder className="CollectionCard" w="300px">
      <Flex direction="column" gap="sm">
        <Group justify="space-between">
          <Text>{props.name}</Text>
          <ActionIcon variant="subtle" c="red" onClick={onRemoveClick}>
            <CuteIcon name="delete-2" />
          </ActionIcon>
        </Group>

        <Center>
          <Text size="sm" c="dimmed" pr="lg">
            {props.sampleIds.length} samples
          </Text>
        </Center>

        <Group gap="md" mt="sm" wrap="nowrap" grow>
          {/* <ActionIcon variant="subtle" color="gray" onClick={onEditClick}>
            <CuteIcon customIcon="mingcute:edit-2-line" />
          </ActionIcon> */}
          <Button variant="outline" size="xs" onClick={onEditClick}>
            Edit
          </Button>
          <Button variant="outline" size="xs" onClick={onBrowseClick}>
            Browse
          </Button>
        </Group>
      </Flex>
    </Card>
  )
}
