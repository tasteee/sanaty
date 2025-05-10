import { $collections } from '#/stores/collections'
import { $folders } from '#/stores/folders'
import { Box } from '@chakra-ui/react/box'
import { Card } from '@chakra-ui/react/card'
import { Image } from '@chakra-ui/react/image'
import { Flex } from '@chakra-ui/react/flex'
import { datass } from 'datass'
import { Text, Stat } from '@chakra-ui/react'
import { navigate } from 'wouter/use-browser-location'
import { editCollectionDialog, EditCollectionDialog } from './Sidebar/EditCollectionDialog'
import { CuteIcon } from './ui/CuteIcon'
import { dialogs } from './dialogs'

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

export const FocusedViewHeader = (props) => {
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

const EditIcon = (props) => {
  const onClick = () => {
    dialogs.editCollection.open(props.id)
  }

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
