import './Sidebar.css'
import { useLocation } from 'wouter'
import { Card, Heading, Separator, HStack, Text, Flex, Circle, CuteIcon, ProgressCircle } from '#/components'
import { MenuItem } from './MenuItem'
import { $sidebar } from '#/stores/sidebar.stoe'
import { CollectionsSection } from './CollectionsSection'
import { Button, Menu, Portal } from '#/components'
import { $main } from '#/stores/main'
import { $assets } from '#/stores/assets'

const addFolder = async () => {
  const allAssets = await window.electron.addFolder()
  $assets.list.set(allAssets)
  console.log('updated assets', allAssets.length, allAssets)
}

const handleAction = (event) => {
  if (event.value === 'addFolder') return addFolder()
  if (event.value === 'settings') return console.log('TODO: Settings Modal')
  if (event.value === 'support') return console.log('TODO: support Modal')
}

const SettingsMenu = () => {
  const isIndexingFolder = $main.isIndexingFolder.use()

  return (
    <Menu.Root onSelect={handleAction}>
      <Menu.Trigger asChild>
        <Button variant="ghost" size="md">
          {!isIndexingFolder && <CuteIcon name="settings-5" />}

          {isIndexingFolder && (
            <ProgressCircle.Root value={null} size="sm">
              <ProgressCircle.Circle>
                <ProgressCircle.Track />
                <ProgressCircle.Range />
              </ProgressCircle.Circle>
            </ProgressCircle.Root>
          )}
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="settings">Settings</Menu.Item>
            <Menu.Item value="support">Support</Menu.Item>
            <Menu.Item value="addFolder">Add Folder</Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}

const useAssetsMenuItems = () => {
  return [
    { id: 'samples', label: 'Samples', route: '/browse/samples' },
    { id: 'midi', label: 'MIDI', route: '/browse/midi' }
  ]
}

export const Sidebar = () => {
  return (
    <Card.Root maxW="sm" height="98%" overflow="hidden" className="Sidebar">
      <Card.Body className="SidebarBody" padding="4">
        <Flex direction="column" height="100%" justify="space-between">
          <Flex direction="column" gap="6" height="100%">
            <LogoSection />
            <Separator />

            <AssetsSection />
            <Separator />

            <CollectionsSection />
          </Flex>
        </Flex>
      </Card.Body>
    </Card.Root>
  )
}

const LogoSection = () => {
  return (
    <Flex className="LogoBox" height="34px" position="relative" justify="space-between">
      <Flex position="relative" className="haederBox">
        <Heading size="3xl" className="glitchLayer0">
          sanaty
        </Heading>
        <Heading size="3xl" className="glitchLayer1">
          sanaty
        </Heading>
        <Heading size="3xl" className="glitchMainLayer">
          sanaty
        </Heading>
      </Flex>
      <SettingsMenu />
    </Flex>
  )
}

const AssetsSection = () => {
  const assetsMenuItems = useAssetsMenuItems()
  const activeMenuItemId = $sidebar.activeMenuItemId.use()

  return (
    <Flex gap="3" direction="column" flex="0">
      <Heading size="xl" mb="0">
        Assets
      </Heading>
      <Flex gap="2" direction="column">
        {assetsMenuItems.map((item) => (
          <MenuItem key={item.id} {...item} isActive={item.id === activeMenuItemId} />
        ))}
      </Flex>
    </Flex>
  )
}

const BottomSection = () => {
  return (
    <Flex gap="2" direction="column" justify="flex-end" flex="0">
      <Text className="softLink">Account</Text>
      <Text className="softLink">Settings</Text>
      <Text className="softLink">Support</Text>
    </Flex>
  )
}
