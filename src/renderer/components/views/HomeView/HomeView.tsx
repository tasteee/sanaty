import { Wrap } from '#/components'
import { $folders } from '#/stores/folders.store'
import { Stat } from '@chakra-ui/react'
import { Button, Flex, Text } from '@mantine/core'
import './HomeView.css'
import { $likes } from '#/stores/likes.store'
import { FolderCard } from '#/components/FolderCard'
import { View } from '#/components/View'

const useTotalSampleCount = () => {
  const folders = $folders.list.use()

  return folders.reduce((final, folder) => {
    return final + (folder.sampleCount || 0)
  }, 0)
}

export const HomeView = () => {
  const folders = $folders.list.use()
  const totalSampleCount = useTotalSampleCount()
  const likes = $likes.store.use()

  return (
    <View id="HomeView" style={{ height: '100vh' }}>
      <View.Heading title="Home" iconName="mingcute:home-6-fill">
        <Button variant="outline" onClick={() => $folders.add()}>
          Add Folder
        </Button>
      </View.Heading>

      <Flex gap="sm" mb="sm" mt="sm" justify="flex-start">
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
          <FolderCard key={folder.id} {...folder} />
        ))}
      </Wrap>

      {/* <ColorsPreviewGrid /> */}
    </View>
  )
}
