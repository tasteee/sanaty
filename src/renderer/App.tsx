import './index.css'
import './styles/general.css'
import '#/modules/_global'
import '@mantine/notifications/styles.css'

import { Provider } from '#/components/Provider'
import { Flex, Toaster, VStack, Spinner, Text } from '#/components'
import { $folders } from './stores/folders.store'
import { NoFoldersView } from './components/NoFoldersView'
import { EditCollectionDialog } from './components/Sidebar/EditCollectionDialog'
import { CreateCollectionDialog } from './components/Sidebar/CreateCollectionDialog'
import { Router } from './Router'
import { $ui } from './stores/ui.store'
import { useRoutingSync } from './modules/useRoutingSync'
import { useMount } from '@siberiacancode/reactuse'
import { setupAppData } from './modules/appSetup'
import { LoadingOverlay } from './components/LoadingOverlay'
import clsx from 'clsx'
import { Notifications } from '@mantine/notifications'
import { NavBar } from './components/NavBar'
import { PlaybackHandler } from './components/PlaybackHandler'
import { AddToCollectionModal } from './components/AddToCollectionModal'

export const App = () => {
  useMount(setupAppData)

  return (
    <Provider>
      <AppFrame />
      <PlaybackHandler />
      <Toaster />
      <Overlays />
      <LoadingOverlay />
      <Notifications />
    </Provider>
  )
}

const Overlays = () => {
  const isCreateCollectionDialogOpen = $ui.isCreateCollectionDialogOpen.use()
  const isEditCollectionDialogOpen = $ui.isEditCollectionDialogOpen.use()

  return (
    <>
      {isEditCollectionDialogOpen && <EditCollectionDialog />}
      {isCreateCollectionDialogOpen && <CreateCollectionDialog handleClose={() => $ui.isCreateCollectionDialogOpen.set(false)} />}
      <AddToCollectionModal />
    </>
  )
}

const AppFrame = () => {
  useRoutingSync()
  const classNames = useAppFrameClassNames()
  console.log({ classNames })
  const folders = $folders.list.use()
  const isSetupDone = $ui.isSetupDone.use()
  if (!isSetupDone) return <MainLoader />
  const content = !folders.length ? <NoFoldersView /> : <Router />

  return (
    <Flex className={classNames} height="100vh">
      <NavBar />
      {content}
    </Flex>
  )
}

const useAppFrameClassNames = () => {
  const isDragging = $ui.isDragging.use()
  const isCompactView = $ui.isCompactViewEnabled.use()
  const isAddingAssetToCollection = $ui.isAddingToCollection.use()
  const addingToCollectionClassName = isAddingAssetToCollection ? 'isAddingSampleToCollection' : ''
  const isCompactViewClassName = isCompactView ? 'isCompactView' : ''
  const isDraggingClassName = isDragging ? 'isDragging' : ''
  return clsx('App', 'AppFrame', addingToCollectionClassName, isCompactViewClassName, isDraggingClassName)
}

const MainLoader = () => {
  return (
    <Flex className="App" flex="1" justify="center" align="center" fullH>
      <VStack colorPalette="teal" fullW fullH>
        <Spinner size="xl" />
      </VStack>
    </Flex>
  )
}
