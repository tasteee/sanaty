import { useToggle } from '@siberiacancode/reactuse'
import { Box, Flex, Portal, IconButton, Text, Tag, Menu, CuteIcon, Popover } from '#/components'
import { HoverCard } from '#/components'
import { PLACEMENTS } from '#/constants'

export const AssetRowOptionsMenu = (props) => {
  const [isOpen, toggleOpen] = useToggle()
  const handleOpenChange = (event) => toggleOpen(event.open)

  const handleSettingsClick = (event) => {
    event.stopPropagation()
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
                <Menu.Item className="hoverCardMenuItem" value="dislike" onClick={handleSettingsClick}>
                  Dislike
                </Menu.Item>
                <Menu.Item className="hoverCardMenuItem" value="support">
                  Support
                </Menu.Item>
                <Menu.Item className="hoverCardMenuItem" value="addFolder">
                  Add Folder
                </Menu.Item>
              </Menu.Content>
            </Menu.Root>
          </HoverCard.Content>
        </HoverCard.Positioner>
      </Portal>
    </HoverCard.Root>
  )
}
