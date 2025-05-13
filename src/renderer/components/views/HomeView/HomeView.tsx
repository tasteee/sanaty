import React from 'react'
import { ViewBox } from '#/components/ui/ViewBox'
import {
  Flex,
  Text,
  Card,
  Button,
  Image,
  HoverTip,
  Grid,
  VStack,
  EmptyState,
  CuteIcon,
  IconButton,
  Heading,
  Separator,
  Wrap
} from '#/components'
import { useElementSize } from '@siberiacancode/reactuse'
import { $folders } from '#/stores/folders.store'
import { useBreakpoints } from '@siberiacancode/reactuse'
import { navigateTo } from '#/modules/routing'
import { Stat } from '@chakra-ui/react'

import './HomeView.css'
import { $likes } from '#/stores/likes.store'
import { ViewHeading } from '#/components/ViewHeading'
import { ACTIVE_BG_GRADIENT } from '#/styles/objects'

const COL_MAP = {
  desktop: 3,
  laptop: 3,
  tablet: 2,
  mobile: 1
}

const useTotalSampleCount = () => {
  const folders = $folders.list.use()

  return folders.reduce((final, folder) => {
    return final + (folder.sampleCount || 0)
  }, 0)
}

export const HomeView = () => {
  const folders = $folders.list.use()
  const totalSampleCount = useTotalSampleCount()
  const breakpoints = useBreakpoints({ single: 0, multi: 830 })
  const activeBreakpoint = breakpoints.active()
  const folderCardWidth = activeBreakpoint === 'single' ? '100%' : ''
  const likes = $likes.store.use()

  return (
    <ViewBox id="HomeView">
      <Flex gap="2" direction="column">
        <ViewHeading title="Home" iconName="mingcute:home-6-fill" />
        <Flex gap="4" mb="4" mt="2" justify="flex-start">
          <Stat.Root borderWidth="1px" p="4" rounded="md" maxWidth="200px">
            <Stat.Label>Folders</Stat.Label>
            <Stat.ValueText>{folders.length}</Stat.ValueText>
          </Stat.Root>
          <Stat.Root borderWidth="1px" p="4" rounded="md" maxWidth="200px">
            <Stat.Label>Samples</Stat.Label>
            <Stat.ValueText>{totalSampleCount}</Stat.ValueText>
          </Stat.Root>
          <Stat.Root borderWidth="1px" p="4" rounded="md" maxWidth="200px">
            <Stat.Label>Likes</Stat.Label>
            <Stat.ValueText>{likes.length}</Stat.ValueText>
          </Stat.Root>
        </Flex>
        <Wrap className="foldersBox" gap="6">
          {folders.map((folder) => (
            <FolderCard key={folder.id} {...folder} width={folderCardWidth} />
          ))}

          <AddFolderCard />
        </Wrap>
      </Flex>
    </ViewBox>
  )
}

const activeStyles = {
  content: '""',
  position: 'absolute',
  top: '-0px',
  bottom: '-0px',
  left: '-0px',
  right: '-0px',
  bgGradient: `linear-gradient(to right, #2c0514, transparent)`,
  borderRadius: 'lg',
  zIndex: 0,
  border: '1px solid #ec4899'
}

const AddFolderCard = () => {
  return (
    <Card.Root
      className="FolderCard"
      colorPalette="pink"
      variant={{ base: 'plain', _hover: 'subtle' }}
      _hover={{ bg: ACTIVE_BG_GRADIENT }}
      style={{ cursor: 'pointer', width: 256, height: 256, padding: 12 }}
      onClick={$folders.add}
      _before={activeStyles}
    >
      <Card.Body gap="2">
        <EmptyState.Root className="addFolderPrompter">
          <EmptyState.Content>
            <EmptyState.Indicator>
              <IconButton variant="plain" colorPalette="pink" zIndex="5">
                <CuteIcon name="new-folder" style={{ scale: 2 }} />
              </IconButton>
            </EmptyState.Indicator>
            <VStack textAlign="center">
              <EmptyState.Title color="pink.400" zIndex="5">
                Add a folder
              </EmptyState.Title>
              <EmptyState.Description color="pink.200" zIndex="5">
                Build the ultimate library
              </EmptyState.Description>
            </VStack>
          </EmptyState.Content>
        </EmptyState.Root>
      </Card.Body>
    </Card.Root>
  )
}

const FolderCard = (props) => {
  const { ref, value } = useElementSize()
  const iconsJustify = value.width < 350 ? 'center' : 'flex-end'
  const height = props.width ? 200 : 256

  return (
    <Card.Root ref={ref} className="FolderCard" style={{ width: props.width || 256, height }}>
      <Card.Body gap="2">
        <Flex gap="2" direction="column">
          <Flex gap="2" align="center">
            <Text textStyle="lg">{props.name}</Text>
            {false && <CuteIcon name="alert-octagon" size="md" color="red.500" />}
          </Flex>
          <FolderPathHoverTip content={props.path}>
            <Text textStyle="sm" color="gray.500" truncate maxW={value}>
              {props.path}
            </Text>
          </FolderPathHoverTip>

          <Flex gap="2" align="center" position="relative">
            <Text>{props.sampleCount} assets</Text>
            <BrowseFolderAssetsIconButton id={props.id} />
          </Flex>
        </Flex>
      </Card.Body>
      <Card.Footer justifyContent={iconsJustify} gap="2">
        <RemoveFolderIconButton id={props.id} />
        <RefreshFolderIconButton id={props.id} />
        <OpenFileExplorerIconButton path={props.path} />
      </Card.Footer>
    </Card.Root>
  )
}

const OpenFileExplorerIconButton = (props) => {
  const onClick = () => window.electron.openExplorerAtPath(props.path)

  return (
    <IconButton variant="ghost" onClick={onClick}>
      <CuteIcon customIcon="majesticons:open-line" />
    </IconButton>
  )
}

const RemoveFolderIconButton = (props) => {
  const onClick = () => $folders.remove(props.id)

  return (
    <IconButton variant="ghost" colorPalette="red" onClick={onClick}>
      <CuteIcon name="delete-2" />
    </IconButton>
  )
}

const RefreshFolderIconButton = (props) => {
  const onClick = () => $folders.refresh(props.id)

  return (
    <IconButton variant="ghost" onClick={onClick}>
      <CuteIcon name="refresh-1" />
    </IconButton>
  )
}

const BrowseFolderAssetsIconButton = (props) => {
  const onClick = () => navigateTo('/folders/folder/' + props.id)
  const style = { position: 'relative', top: 2 }

  return (
    <IconButton style={style} variant="ghost" colorPalette="pink" onClick={onClick} size="2xs">
      <CuteIcon name="search-3" />
    </IconButton>
  )
}

const FolderPathHoverTip = (props) => {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleOpenChange = (event) => {
    setIsOpen(event.open)
  }

  return <HoverTip isOpen={isOpen} content="Tooltip Content" onOpenChange={handleOpenChange} {...props} />
}
