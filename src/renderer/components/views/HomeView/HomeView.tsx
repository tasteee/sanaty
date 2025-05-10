import { ViewBox } from '#/components/ui/ViewBox'
import React from 'react'
import { Flex, Text, Card, Button, Image, HoverTip, Grid, CuteIcon, IconButton, Heading } from '#/components'
import { useElementSize } from '@siberiacancode/reactuse'
import { $folders } from '#/stores/folders'
import { useBreakpoints } from '@siberiacancode/reactuse'
import { useLocation } from 'wouter'
import './HomeView.css'

const COL_MAP = {
  desktop: 3,
  laptop: 3,
  tablet: 2,
  mobile: 1
}

export const HomeView = () => {
  const folders = $folders.list.use()
  const breakpoints = useBreakpoints({ mobile: 0, tablet: 840, laptop: 1100, desktop: 1300 })
  const active = breakpoints.active()
  const templateColumns = `repeat(${COL_MAP[active]}, 1fr)`
  const fileSystemErrors = $main.fileSystemErrors.use()

  const checkFolderIssues = (folder) => {
    const isMissing = fileSystemErrors.missingFolderIds.includes(folder._id)

    const hasMissingSamples = fileSystemErrors.missingSamples.some((sample) => {
      return sample.folderId === folder._id
    })

    return isMissing || hasMissingSamples
  }

  return (
    <ViewBox id="HomeView">
      <Flex gap="2" direction="column">
        <Flex gap="4" mb="2" align="center">
          <CuteIcon name="folders" size="xl" style={{ marginTop: 2 }} />
          <Heading size="3xl">Folders</Heading>
        </Flex>
        <Grid templateColumns={templateColumns} gap="6">
          {folders.map((folder) => (
            <FolderCard key={folder._id} {...folder} hasIssues={checkFolderIssues(folder)} />
          ))}

          <AddFolderCard />
        </Grid>
      </Flex>
    </ViewBox>
  )
}

import { EmptyState, VStack } from '@chakra-ui/react'
import { $main } from '#/stores/main'

const activeStyles = {
  content: '""',
  position: 'absolute',
  top: '-0px',
  bottom: '-3px',
  left: '-3px',
  right: '-3px',
  bgGradient: `linear-gradient(to right, #2c0514, transparent)`,
  borderRadius: 'lg',
  zIndex: 0,
  border: '1px solid #ec4899'
}

const ACTIVE_BG_GRADIENT = 'linear-gradient(to right, #18181b, transparent)'

const AddFolderCard = () => {
  return (
    <Card.Root
      className="FolderCard"
      colorPalette="pink"
      variant={{ base: 'plain', _hover: 'subtle' }}
      _hover={{ bg: ACTIVE_BG_GRADIENT }}
      style={{ cursor: 'pointer' }}
      onClick={$folders.addFolder}
      _before={activeStyles}
      // style={{ background: 'none', border: '1px dashed #a1a1aa' }}
    >
      <Card.Body gap="2">
        <EmptyState.Root>
          <EmptyState.Content>
            <EmptyState.Indicator>
              <IconButton variant="plain" colorPalette="pink" zIndex="9999">
                <CuteIcon name="new-folder" style={{ scale: 2 }} />
              </IconButton>
            </EmptyState.Indicator>
            <VStack textAlign="center">
              <EmptyState.Title color="pink.400" zIndex="9999">
                Add a folder
              </EmptyState.Title>
              <EmptyState.Description color="pink.200" zIndex="9999">
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

  return (
    <Card.Root ref={ref} className="FolderCard">
      <Card.Body gap="2">
        <Flex gap="2" direction="column">
          <Flex gap="2" align="center">
            <Text textStyle="lg">{props.name}</Text>
            {props.hasIssues && <CuteIcon name="alert-octagon" size="md" color="red.500" />}
          </Flex>
          <FolderPathHoverTip content={props.path}>
            <Text textStyle="sm" color="gray.500" truncate maxW={value}>
              {props.path}
            </Text>
          </FolderPathHoverTip>

          <Flex gap="2" align="center" position="relative">
            <Text>{props.sampleCount} assets</Text>
            <BrowseFolderAssetsIconButton id={props._id} />
          </Flex>
        </Flex>
      </Card.Body>
      <Card.Footer justifyContent={iconsJustify} gap="2">
        <RemoveFolderIconButton id={props._id} />
        <RefreshFolderIconButton id={props._id} />
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
  const onClick = () => $folders.removeFolder(props.id)

  return (
    <IconButton variant="ghost" colorPalette="red" onClick={onClick}>
      <CuteIcon name="delete-2" />
    </IconButton>
  )
}

const RefreshFolderIconButton = (props) => {
  const onClick = () => $folders.refreshFolder(props.id)

  return (
    <IconButton variant="ghost" onClick={onClick}>
      <CuteIcon name="refresh-1" />
    </IconButton>
  )
}

const BrowseFolderAssetsIconButton = (props) => {
  const [, setLocation] = useLocation()
  const onClick = () => setLocation('/folders/folder/' + props.id)
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
