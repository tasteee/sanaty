import { $collections } from '#/stores/collections.store'
import { Flex, Button, ButtonGroup, EmptyState, VStack } from '@chakra-ui/react'
import { CuteIcon } from '#/components/ui/CuteIcon'
import { $ui } from '#/stores/ui.store'

export const NoCollectionsView = () => {
  return (
    <Flex direction="column" flex="1" overflow="hidden" justify="center">
      <EmptyState.Root>
        <EmptyState.Content>
          <EmptyState.Indicator>
            <CuteIcon name="sad" size={100} />
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

  if (!collections.length) {
    return <NoCollectionsView />
  }

  return (
    <Flex gap="2" direction="column" className="CollectionsView">
      <h1>howdy</h1>
    </Flex>
  )
}
