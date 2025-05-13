import './CollectionsSection.css'
import { MenuItem } from './MenuItem'
import { Button, CuteIcon, Em, Flex, Heading, Text } from '#/components'
import { $collections } from '#/stores/collections.store'
import { useLocation } from 'wouter'
import { $ui } from '#/stores/ui.store'
import { navigateTo } from '#/modules/routing'

export const CollectionsSection = () => {
  const [location] = useLocation()
  const collectionsMenuItems = $collections.store.use()
  const collectionsCount = collectionsMenuItems.length
  const isAddingToCollection = $ui.isAddingToCollection.use()
  const collectionAdditionSampleId = $ui.collectionAdditionSampleId.use()
  const iconName = isAddingToCollection ? 'add-square' : 'playlist-2'
  const iconStyle = isAddingToCollection ? { scale: 1.25, marginTop: 3 } : {}
  const iconColor = isAddingToCollection ? 'orange.500' : ''
  const style = isAddingToCollection ? { color: 'white !important' } : {}

  const getMenuItemClickHandler = (item) => {
    if (!isAddingToCollection) return navigateTo(`/collections/collection/${item.id}`)
    const sampleId = collectionAdditionSampleId
    $collections.addSampleToCollection(item.id, sampleId)
    $ui.turnAddToCollectionModeOff()
  }

  return (
    <Flex className="SideBarCollectionsSection" direction="column" minHeight="0" overflow="hidden" flex="1">
      <Flex gap="3" direction="column">
        <Heading size="xl" className="collectionsSectionHeader">
          Collections
          <Em ml="2" fontWeight="normal" textStyle="md" className="emphasizedSubtext">
            ({collectionsCount})
          </Em>
        </Heading>
        <Flex className="collectionsBox" direction="column" gap="2" overflowY="scroll" pr="0" height="670px">
          <AddCollectionMenuItem />

          {collectionsMenuItems.map((item) => (
            <MenuItem
              className="collectionMenuItem"
              key={item.id}
              id={item.id}
              label={item.name}
              subLabel={`(${item.sampleIds.length})`}
              style={{ ...style, paddingRight: 24 }}
              isActive={location === `/collections/collection/${item.id}`}
              onClick={() => getMenuItemClickHandler(item)}
              iconName={iconName}
              iconStyle={iconStyle}
              iconColor={iconColor}
            >
              {!isAddingToCollection && (
                <CuteIcon
                  className="collectionMenuItemTrashIcon"
                  name="delete-2"
                  size="md"
                  onClick={(event) => {
                    event.stopPropagation()
                    if (location === `/collections/collection/${item.id}`) navigateTo('/')
                    $collections.delete(item.id)
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
    $ui.isCreateCollectionDialogOpen.set(true)
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
