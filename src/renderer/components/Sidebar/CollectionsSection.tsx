import './CollectionsSection.css'
import { MenuItem } from './MenuItem'
import { Button, CuteIcon, Flex, Heading, Text } from '#/components'
import { $sidebar } from '#/stores/sidebar.stoe'

const useCollectionsMenuItems = () => {
  return [
    { id: '234', label: 'foo bar baz', route: '/collections/234' },
    { id: '345', label: 'meow MEOW !!!', route: '/collections/345' },
    { id: '123', label: 'My Collection 0', route: '/collections/123' },
    { id: '1', label: 'foo bar baz', route: '/collections/1' },
    { id: '2', label: 'meow MEOW !!!', route: '/collections/2' },
    { id: '3', label: 'My Collection 0', route: '/collections/3' },
    { id: '4', label: 'foo bar baz', route: '/collections/4' },
    { id: '5', label: 'meow MEOW !!!', route: '/collections/5' },
    { id: '55', label: 'My Collection 0', route: '/collections/55' },
    { id: '6', label: 'foo bar baz', route: '/collections/6' },
    { id: '77', label: 'meow MEOW !!!', route: '/collections/77' },
    { id: '11', label: 'My Collection 0', route: '/collections/11' },
    { id: '22', label: 'foo bar baz', route: '/collections/22' },
    { id: '111', label: 'meow MEOW !!!', route: '/collections/111' },
    { id: '222', label: 'My Collection 0', route: '/collections/222' },
    { id: '333', label: 'foo bar baz', route: '/collections/333' },
    { id: '444', label: 'meow MEOW !!!', route: '/collections/444' },
    { id: '555', label: 'My Collection 0', route: '/collections/555' },
    { id: '153', label: 'foo bar baz', route: '/collections/153' },
    { id: '653', label: 'meow MEOW !!!', route: '/collections/653' },
    { id: '1353', label: 'My Collection 0', route: '/collections/1353' },
    { id: '6765', label: 'foo bar baz', route: '/collections/6765' },
    { id: '753', label: 'meow MEOW !!!', route: '/collections/753' },
    { id: '6262', label: 'meow MEOW !!!', route: '/collections/6262' },
    { id: '24742', label: 'My Collection 0', route: '/collections/24742' },
    { id: '161616', label: 'foo bar baz', route: '/collections/161616' },
    { id: '01599', label: 'meow MEOW !!!', route: '/collections/01599' },
    { id: '12346', label: 'LAST Collection!!', route: '/collections/12346' }
  ]
}

export const CollectionsSection = () => {
  const collectionsMenuItems = useCollectionsMenuItems()
  const activeMenuItemId = $sidebar.activeMenuItemId.use()

  return (
    <Flex direction="column" minHeight="0" overflow="hidden" flex="1">
      <Flex gap="3" direction="column">
        <Heading size="xl">Collections</Heading>
        <Flex className="collectionsBox" direction="column" gap="2" overflowY="scroll" pr="0" height="670px">
          <AddCollectionMenuItem />
          {collectionsMenuItems.map((item) => (
            <MenuItem
              className="collectionMenuItem"
              key={item.id}
              {...item}
              isActive={item.id === activeMenuItemId}
              style={{ paddingRight: 8 }}
            >
              <CuteIcon className="trashyIcon" name="delete-2" size={16} />
            </MenuItem>
          ))}
        </Flex>
      </Flex>
    </Flex>
  )
}

const AddCollectionMenuItem = () => {
  const onClick = () => {
    // open modal to create collection
  }

  return (
    <Flex className="AddCollectionMenuItem" onClick={onClick} position="relative" align="center" gap="2">
      <CuteIcon name="add" size={16} />
      <Text>New Collection</Text>
    </Flex>
  )
}
