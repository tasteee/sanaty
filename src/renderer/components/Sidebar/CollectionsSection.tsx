import './CollectionsSection.css'
import { MenuItem } from './MenuItem'
import { Button, CuteIcon, Flex, Heading, Text } from '#/components'
import { $collections } from '#/stores/collections.store'
import { useLocation } from 'wouter'
import { dialogs } from '../dialogs'
import { $ui } from '#/stores/ui.store'

export const CollectionsSection = () => {
  const [location, setLocation] = useLocation()
  const collectionsMenuItems = $collections.store.use()
  const collectionsCount = collectionsMenuItems.length
  const isAddingToCollection = $ui.isAddingToCollection.use()
  const collectionAdditionSampleId = $ui.collectionAdditionSampleId.use()
  const iconName = isAddingToCollection ? 'add-square' : 'playlist-2'

  const getMenuItemClickHandler = (item) => {
    if (!isAddingToCollection) return setLocation(`/collections/collection/${item._id}`)
    const sampleId = collectionAdditionSampleId
    $collections.addSampleToCollection(item._id, sampleId)
    $ui.turnAddToCollectionModeOff()
  }

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
              style={{ paddingRight: 24 }}
              isActive={location === `/collections/collection/${item._id}`}
              onClick={() => getMenuItemClickHandler(item)}
              iconName={iconName}
            >
              {!isAddingToCollection && (
                <CuteIcon
                  className="collectionMenuItemTrashIcon"
                  name="delete-2"
                  size="md"
                  onClick={(event) => {
                    event.stopPropagation()
                    if (location === `/collections/collection/${item._id}`) setLocation('/')
                    $collections.delete(item._id)
                  }}
                />
              )}
            </MenuItem>
          ))}
        </Flex>
      </Flex>
    </Flex>
  )
}

const AddCollectionMenuItem = () => {
  const onClick = () => {
    dialogs.createCollection.open()
  }

  return (
    <>
      <Flex className="AddCollectionMenuItem" onClick={onClick} position="relative" align="center" gap="2">
        <CuteIcon name="add" size="sm" />
        <Text>New Collection</Text>
      </Flex>
    </>
  )
}
