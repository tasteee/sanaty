import { $collections } from '#/stores/collections.store'
import { $folders } from '#/stores/folders.store'
import { Box } from '@chakra-ui/react/box'
import { Card } from '@chakra-ui/react/card'
import { Image } from '@chakra-ui/react/image'
import { Flex } from '@chakra-ui/react/flex'
import { Text, Stat } from '@chakra-ui/react'
import { CuteIcon } from './ui/CuteIcon'
import { navigateTo } from '#/modules/routing'
import { $ui } from '#/stores/ui.store'
import { ACTIVE_BG_GRADIENT, activeStyles } from '#/styles/objects'

const customActiveStyles = {
  ...activeStyles,
  top: '-0px',
  bottom: '-0',
  left: '-0',
  right: '-0'
}

const _hover = { bg: ACTIVE_BG_GRADIENT }
const variantObject = { base: 'plain', _hover: 'subtle' }

export const FocusedViewHeader = (props) => {
  return (
    <Card.Root
      borderWidth="1px"
      p="0px"
      rounded="md"
      colorPalette="pink"
      variant={variantObject}
      _hover={_hover}
      _before={customActiveStyles}
      className="FocusedViewHeader"
    >
      <Card.Body p="8px">
        <Flex gap="2">
          <Box maxW="100px" borderWidth="1px" p="0" rounded="md" overflow="hidden" zIndex="10000">
            <Image src="https://placehold.co/400" />
          </Box>

          <Stat.Root>
            <Stat.Label zIndex="10" color="pink.200">
              {props.kind}
            </Stat.Label>
            <Flex gap="2" direction="column">
              <Stat.ValueText zIndex="10" truncate>
                {props.name}
              </Stat.ValueText>
              <Text color="pink.100" zIndex="10" truncate size="xs">
                {props.description}
              </Text>
            </Flex>
          </Stat.Root>
          <HeaderOptions {...props} />
        </Flex>
      </Card.Body>
    </Card.Root>
  )
}

// Only renders on collection view.
const EditIcon = (props) => {
  const onClick = () => {
    $ui.isEditCollectionDialogOpen.set(true)
  }

  return <CuteIcon onClick={onClick} isActionable name="edit-2" size="lg" color={{ base: 'gray.300', _hover: 'pink.500' }} zIndex="10000" />
}

// Only rendered when folder view.
// why tf wud u wanna refresh a collection???
// ... weirdo.
const RefreshIcon = (props) => {
  const onClick = () => $folders.refresh(props.id)
  return <CuteIcon onClick={onClick} name="refresh-1" size="lg" color={{ base: 'gray.300', _hover: 'blue.300' }} zIndex="10000" />
}

// When delete icon is rendered, it means the user
// is currently viewing the page that shows that collection
// and its samples. We want to navigate away before we
// delete it so it doesnt cause our shit to crash when
// useCollection(id) returns nada. (Now read it again
// but replace collection with folder -- because this icon
// works for both folders and collections.
const DeleteIcon = (props) => {
  const color = { base: 'gray.300', _hover: 'red.600' }
  const isCollection = props.kind === 'Collection'
  const collectionDeleter = $collections.delete
  const folderDeleter = $folders.remove
  const deleter = isCollection ? collectionDeleter : folderDeleter

  const onClick = () => {
    navigateTo('/samples')
    deleter(props.id)
  }

  return <CuteIcon onClick={onClick} isActionable name="delete-2" size="lg" color={color} zIndex="10000" />
}

const HeaderOptions = (props) => {
  const TopIcon = props.kind === 'Collection' ? EditIcon : RefreshIcon

  return (
    <Flex maxW="64px" width="64px" overflow="hidden" justify="center" align="center" gap="4" direction="column">
      <TopIcon {...props} />
      <DeleteIcon {...props} />
    </Flex>
  )
}
