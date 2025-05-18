import { Flex, Button, ButtonGroup, EmptyState, VStack } from '@chakra-ui/react'
import { CuteIcon } from './CuteIcon'
import { $folders } from '#/stores/folders.store'

export const NoFoldersView = () => {
  return (
    <Flex direction="column" flex="1" overflow="hidden" justify="center">
      <EmptyState.Root>
        <EmptyState.Content>
          <EmptyState.Indicator>
            <CuteIcon name="sad" size="2xl" />
          </EmptyState.Indicator>
          <VStack textAlign="center">
            <EmptyState.Title>Start adding a folder</EmptyState.Title>
            <EmptyState.Description>Add a folder for sanaty to index assets from.</EmptyState.Description>
          </VStack>
          <ButtonGroup>
            <Button onClick={$folders.add}>Select Folder</Button>
          </ButtonGroup>
        </EmptyState.Content>
      </EmptyState.Root>
    </Flex>
  )
}
