import './Sidebar.css'
import { useLocation } from 'wouter'
import { Card, Heading, Separator, HStack, Text, Flex, Circle, CuteIcon, ProgressCircle, IconButton } from '#/components'
import { MenuItem } from './MenuItem'
import { CollectionsSection } from './CollectionsSection'
import { Button, Menu, Portal } from '#/components'
import { $ui } from '#/stores/ui.store'
import { $folders } from '#/stores/folders.store'
import { navigateTo } from '#/modules/routing'
import clsx from 'clsx'

export const Sidebar = () => {
  const isAddingAssetToCollection = $ui.isAddingToCollection.use()
  const addingToCollectionClassName = isAddingAssetToCollection ? 'isAddingSampleToCollection' : ''
  const className = clsx('Sidebar', addingToCollectionClassName)

  return (
    <Card.Root maxW="sm" height="98%" overflow="hidden" className={className}>
      <Card.Body className="SidebarBody" padding="4">
        <Flex direction="column" height="100%" justify="space-between">
          <Flex direction="column" gap="6" height="100%" className="sectionsColumn">
            <LogoSection />
            <Separator />
            <TopNavSection />
            <Separator />
            <CollectionsSection />
          </Flex>
        </Flex>
      </Card.Body>
    </Card.Root>
  )
}

const LogoSection = () => {
  const isCompactView = $ui.isCompactViewEnabled.use()
  const sizeIconName = isCompactView ? 'clarity:resize-up-line' : 'clarity:resize-down-line'

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
      <Flex gap="1">
        <IconButton variant="ghost" onClick={() => $ui.isCompactViewEnabled.set.toggle()}>
          <CuteIcon customIcon={sizeIconName} />
        </IconButton>
        <IconButton variant="ghost" onClick={() => window.location.reload()}>
          <CuteIcon name="refresh-1" />
        </IconButton>
      </Flex>
    </Flex>
  )
}

const TopNavSection = () => {
  const [location] = useLocation()
  const isHomeActive = location === '/' || location === '/index.html'
  const isSamplesActive = location === '/samples'
  const isMidiActive = location === '/midi'
  const isFoldersActive = location.startsWith('/folders')

  return (
    <Flex gap="3" direction="column" flex="0">
      <Heading size="xl" mb="0">
        Assets
      </Heading>
      <Flex gap="2" direction="column">
        <MenuItem id="home" label="Home" isActive={isHomeActive} onClick={() => navigateTo('/')} />
        <MenuItem id="folders" label="Folders" isActive={isFoldersActive} onClick={() => navigateTo('/folders')} />
        <MenuItem id="samples" label="Samples" isActive={isSamplesActive} onClick={() => navigateTo('/samples')} />
        <MenuItem id="midi" label="MIDI" isActive={isMidiActive} onClick={() => navigateTo('/midi')} />
      </Flex>
    </Flex>
  )
}
