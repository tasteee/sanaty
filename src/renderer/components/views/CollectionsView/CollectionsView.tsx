import { Card } from '@chakra-ui/react/card'
import { SamplesView } from '../SamplesView/SamplesView'
import { Text } from '@chakra-ui/react/typography'
import { $collections } from '#/stores/collections'
import { Flex } from '@chakra-ui/react/flex'
import { useRoute } from 'wouter'
import { Stat } from '@chakra-ui/react'
import React from 'react'
import { useMount } from '@siberiacancode/reactuse'
import { Image } from '@chakra-ui/react/image'
import { Box } from '@chakra-ui/react/box'
import { CuteIcon } from '#/components/ui/CuteIcon'
import { $samplesViewStore } from '../SamplesView/samplesView.store'
import { $folders } from '#/stores/folders'
import { datass } from 'datass'
import { CreateCollectionDialog } from '#/components/Sidebar/CreateCollectionDialog'
import { EditCollectionDialog } from '#/components/Sidebar/EditCollectionDialog'
import { navigate } from 'wouter/use-browser-location'

export const CollectionView = () => {
  const route = useRoute('/collections/collection/:collectionId')
  const params = route[1] as any
  const collection = $collections.useCollection(params.collectionId)
  const sampleCount = collection.sampleIds.length

  useMount(() => {
    $samplesViewStore.filters.set.reset()
    $samplesViewStore.results.set.reset()
    $samplesViewStore.currentPageResults.set.reset()
    $samplesViewStore.filters.set({ collectionId: params.collectionId })
    $samplesViewStore.submitSearch()
  })

  return (
    <SamplesView id="CollectionView">
      <FocusedViewHeader
        kind="Collection"
        sampleCount={sampleCount}
        name={collection.name}
        description={collection.description}
        id={collection._id}
      />
    </SamplesView>
  )
}

export const FolderView = () => {
  const route = useRoute('/folders/folder/:folderId')
  const params = route[1] as any
  const folder = $folders.useFolder(params.folderId)

  useMount(() => {
    $samplesViewStore.filters.set.reset()
    $samplesViewStore.results.set.reset()
    $samplesViewStore.currentPageResults.set.reset()
    $samplesViewStore.filters.set({ folderId: params.folderId })
    $samplesViewStore.submitSearch()
  })

  return (
    <SamplesView id="FolderView">
      <FocusedViewHeader
        kind="Folder"
        sampleCount={folder.sampleCount}
        name={folder.name}
        description={folder.path}
        id={folder._id}
      />
    </SamplesView>
  )
}

const activeStyles = {
  content: '""',
  position: 'absolute',
  top: '-0px',
  bottom: '-0',
  left: '-0',
  right: '-0',
  bgGradient: `linear-gradient(to right, #2c0514, transparent)`,
  borderRadius: 'lg',
  zIndex: 0,
  border: '1px solid #ec4899'
}

const ACTIVE_BG_GRADIENT = 'linear-gradient(to right, #18181b, transparent)'

const FocusedViewHeader = (props) => {
  return (
    <Card.Root
      borderWidth="1px"
      p="0px"
      rounded="md"
      colorPalette="pink"
      variant={{ base: 'plain', _hover: 'subtle' }}
      _hover={{ bg: ACTIVE_BG_GRADIENT }}
      _before={activeStyles}
    >
      <Card.Body p="8px">
        <Flex gap="2">
          <Box maxW="100px" borderWidth="1px" p="0" rounded="md" overflow="hidden" zIndex="10000">
            <Image src="https://placehold.co/400" />
          </Box>

          <Stat.Root>
            <Stat.Label zIndex="9999" color="pink.200">
              {props.kind}
            </Stat.Label>
            <Flex gap="2" direction="column">
              <Stat.ValueText zIndex="9999" truncate>
                {props.name}
              </Stat.ValueText>
              <Text color="pink.100" zIndex="9999" truncate size="xs">
                {props.description}
              </Text>
            </Flex>
          </Stat.Root>
          <HeaderOptions kind={props.kind} id={props.id} />
        </Flex>
      </Card.Body>
    </Card.Root>
  )
}

const $isEditCollectionDialogOpen = datass.boolean(false)

const EditIcon = (props) => {
  const isEditCollectionDialogOpen = $isEditCollectionDialogOpen.use()
  const onClick = () => $isEditCollectionDialogOpen.set(true)

  return (
    <>
      <CuteIcon
        onClick={onClick}
        isActionable
        name="edit-2"
        size="lg"
        color={{ base: 'gray.300', _hover: 'pink.500' }}
        zIndex="10000"
      />
      {isEditCollectionDialogOpen && (
        <EditCollectionDialog id={props.id} handleClose={() => $isEditCollectionDialogOpen.set(false)} />
      )}
    </>
  )
}

const RefreshIcon = (props) => {
  const onClick = () => $folders.refreshFolder(props.id)
  return (
    <CuteIcon onClick={onClick} name="refresh-1" size="lg" color={{ base: 'gray.300', _hover: 'blue.300' }} zIndex="10000" />
  )
}

const DeleteIcon = (props) => {
  const onClick = () => {
    navigate('/samples')
    $collections.deleteCollection(props.id)
  }

  return (
    <CuteIcon
      onClick={onClick}
      isActionable
      name="delete-2"
      size="lg"
      color={{ base: 'gray.300', _hover: 'red.600' }}
      zIndex="10000"
    />
  )
}

const HeaderOptions = (props) => {
  const TopIcon = props.kind === 'Collection' ? EditIcon : RefreshIcon

  return (
    <Flex maxW="64px" width="64px" overflow="hidden" justify="center" align="center" gap="4" direction="column">
      <TopIcon id={props.id} />
      <DeleteIcon id={props.id} />
    </Flex>
  )
}
