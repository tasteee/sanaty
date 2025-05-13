import { useToggle } from '@siberiacancode/reactuse'
import { Box, Flex, Portal, IconButton, Text, Tag, Menu, CuteIcon, Popover } from '#/components'
import { HoverCard } from '#/components'
import { PLACEMENTS } from '#/constants'
import { $ui } from '#/stores/ui.store'
import { $collections } from '#/stores/collections.store'
import { $search } from '#/stores/search.store'

function handleSettingsMenuClick() {}

export const AssetRowOptionsMenu = (props) => {
  const [isOpen, toggleOpen] = useToggle()
  const handleOpenChange = (event) => toggleOpen(event.open)

  const handleSettingsClick = (event) => {
    event.stopPropagation()
    console.log('...', event.value)
    toggleOpen(false)
  }

  return (
    <HoverCard.Root positioning={PLACEMENTS.BOTTOM_END} onOpenChange={handleOpenChange} openDelay={150}>
      <HoverCard.Trigger asChild>
        <IconButton variant="plain" colorPalette={{ base: 'gray', _hover: 'purple' }}>
          <CuteIcon name="more-3" />
        </IconButton>
      </HoverCard.Trigger>
      <Portal>
        <HoverCard.Positioner>
          <HoverCard.Content className="hoverCardContent" as={Flex}>
            <Menu.Root open={isOpen} maxW>
              <Menu.Content style={{ zIndex: 99999 }}>
                <Menu.Item className="hoverCardMenuItem" value="dislike">
                  Dislike
                </Menu.Item>
                <Menu.Item className="hoverCardMenuItem" value="support">
                  Support
                </Menu.Item>

                {isOpen && <LastItem id={props.id} />}
              </Menu.Content>
            </Menu.Root>
          </HoverCard.Content>
        </HoverCard.Positioner>
      </Portal>
    </HoverCard.Root>
  )
}

const LastItem = (props) => {
  const routeEntityType = $ui.routeEntityType.use()
  const routeEntityId = $ui.routeEntityId.use()
  if (routeEntityType !== 'collection' || !routeEntityId) return null

  async function handleRemoveFromCollectionClick(event) {
    event.stopPropagation()
    console.log('handleRemoveFromCollectionClick', routeEntityId, ' &&&&& ', props.id)
    await $collections.removeSampleFromCollection(routeEntityId, props.id)
    $search.softSearchSamples()
  }

  return (
    <Menu.Item className="hoverCardMenuItem" value="removeFromCollection" onClick={handleRemoveFromCollectionClick}>
      Remove from collection
    </Menu.Item>
  )
}
