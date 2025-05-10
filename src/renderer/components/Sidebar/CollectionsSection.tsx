import './CollectionsSection.css'
import { MenuItem } from './MenuItem'
import { Button, CuteIcon, Flex, Heading, Text } from '#/components'
import { $collections } from '#/stores/collections'
import { datass } from 'datass'
import { CreateCollectionDialog } from './CreateCollectionDialog'
import { useLocation } from 'wouter'
import { dialogs } from '../dialogs'
import { $samplesViewStore } from '../views/SamplesResultsView/samplesView.store'

export const CollectionsSection = () => {
  const [location, setLocation] = useLocation()
  const collectionsMenuItems = $collections.list.use() as CollectionT[]
  const collectionsCount = collectionsMenuItems.length
  const addToCollectionState = $samplesViewStore.addToCollectionStore.use()
  const iconName = addToCollectionState.isActive ? 'add-square' : 'playlist-2'

  const getMenuItemClickHandler = (item) => {
    if (!addToCollectionState.isActive) return setLocation(`/collections/collection/${item._id}`)
    const sampleId = addToCollectionState.sampleId
    $collections.addSampleToCollection(item._id, sampleId)
    $samplesViewStore.toggleAddToCollectionMode()
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
              {!addToCollectionState.isActive && (
                <CuteIcon
                  className="collectionMenuItemTrashIcon"
                  name="delete-2"
                  size="md"
                  onClick={(event) => {
                    event.stopPropagation()
                    if (location === `/collections/collection//${item._id}`) setLocation('/')
                    $collections.deleteCollection(item._id)
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
