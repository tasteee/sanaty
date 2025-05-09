import { ViewBox } from '#/components/ui/ViewBox'
import React from 'react'
import { Flex, Text, Card, Button, Image, HoverTip, Grid } from '#/components'
import { useElementSize } from '@siberiacancode/reactuse'
import { $folders } from '#/stores/folders'
import { useBreakpoints } from '@siberiacancode/reactuse'

const COL_MAP = {
  desktop: 3,
  laptop: 2,
  tablet: 1,
  mobile: 1
}

export const HomeView = () => {
  const folders = $folders.list.use()
  const breakpoints = useBreakpoints({ mobile: 0, tablet: 640, laptop: 1024, desktop: 1280 })
  const active = breakpoints.active()
  const templateColumns = `repeat(${COL_MAP[active]}, 1fr)`

  return (
    <ViewBox id="HomeView">
      <Grid templateColumns={templateColumns} gap="6">
        {folders.map((folder) => (
          <FolderCard key={folder._id} {...folder} />
        ))}
      </Grid>
    </ViewBox>
  )
}

const FolderCard = (props) => {
  const { ref, value } = useElementSize()
  const [assetCount, setAssetCount] = React.useState(0)

  React.useEffect(() => {
    $folders.getFolderSampleCount(props._id).then(setAssetCount)
  }, [props._id])

  const removeFolder = () => {
    console.log('removeFolder', { props })
    $folders.removeFolder(props._id)
  }

  const refreshFolder = () => {
    console.log('refreshFolder', { props })

    $folders.refreshFolder(props._id)
  }

  return (
    <Card.Root ref={ref} className="FolderCard">
      <Card.Body gap="2">
        <Flex gap="2" direction="column">
          <Text textStyle="lg">{props.name}</Text>
          <FolderPathHoverTip content={props.path}>
            <Text textStyle="sm" color="gray.500" truncate maxW={value}>
              {props.path}
            </Text>
          </FolderPathHoverTip>
          <Text>{props.sampleCount} assets</Text>
        </Flex>
      </Card.Body>
      <Card.Footer justifyContent="flex-end">
        <Button variant="outline" colorPalette="red" onClick={removeFolder}>
          Remove
        </Button>
        <Button onClick={refreshFolder}>Refresh</Button>
      </Card.Footer>
    </Card.Root>
  )
}

const FolderPathHoverTip = (props) => {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleOpenChange = (event) => {
    setIsOpen(event.open)
  }

  return <HoverTip isOpen={isOpen} content="Tooltip Content" onOpenChange={handleOpenChange} {...props} />
}
