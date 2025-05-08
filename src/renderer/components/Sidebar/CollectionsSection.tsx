import './CollectionsSection.css'
import { MenuItem } from './MenuItem'
import { Button, CuteIcon, Flex, Heading, Text } from '#/components'
import { $collections } from '#/stores/collections'
import { datass } from 'datass'
import { CreateCollectionDialog } from './CreateCollectionDialog'
import { useLocation } from 'wouter'
import { $sidebar } from '#/stores/sidebar.stoe'

export const CollectionsSection = () => {
  const [location, setLocation] = useLocation()
  const collectionsMenuItems = $collections.list.use() as CollectionT[]
  const collectionsCount = collectionsMenuItems.length

  return (
    <Flex direction="column" minHeight="0" overflow="hidden" flex="1">
      <Flex gap="3" direction="column">
        <Heading size="xl">Collections ({collectionsCount})</Heading>
        <Flex className="collectionsBox" direction="column" gap="2" overflowY="scroll" pr="0" height="670px">
          <AddCollectionMenuItem />

          {collectionsMenuItems.map((item) => (
            <MenuItem
              className="collectionMenuItem"
              key={item._id}
              id={item._id}
              label={item.name}
              style={{ paddingRight: 8 }}
              isActive={location === `/collections/${item._id}`}
              onClick={() => setLocation(`/collections/${item._id}`)}
              iconName="playlist-2"
            >
              <CuteIcon
                className="trashyIcon"
                name="delete-2"
                size={16}
                onClick={(event) => {
                  event.stopPropagation()
                  if (location === `/collections/${item._id}`) setLocation('/')
                  $collections.deleteCollection(item._id)
                }}
              />
            </MenuItem>
          ))}
        </Flex>
      </Flex>
    </Flex>
  )
}

const $isCreateCollectionDialogOpen = datass.boolean(false)

const AddCollectionMenuItem = () => {
  const isCreateCollectionDialogOpen = $isCreateCollectionDialogOpen.use()

  const onClick = () => {
    $isCreateCollectionDialogOpen.set(true)
  }

  return (
    <>
      <Flex className="AddCollectionMenuItem" onClick={onClick} position="relative" align="center" gap="2">
        <CuteIcon name="add" size={16} />
        <Text>New Collection</Text>
      </Flex>
      {isCreateCollectionDialogOpen && (
        <CreateCollectionDialog handleClose={() => $isCreateCollectionDialogOpen.set(false)} />
      )}
    </>
  )
}
