import './index.css'
import './styles/general.css'
import '#/modules/_global'
import { Sidebar } from '#/components/Sidebar'
import { Provider, Flex, Toaster, VStack, Spinner, Text } from '#/components'
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
import { FilterBar } from './components/FilterBar'
import clsx from 'clsx'

export function App() {
  useMount(setupAppData)

  return (
    <Provider>
      <AppFrame />
      <Toaster />
      <Overlays />
      <LoadingOverlay />
    </Provider>
  )
}

const Overlays = () => {
  const isCreateCollectionDialogOpen = $ui.isCreateCollectionDialogOpen.use()
  const isEditCollectionDialogOpen = $ui.isEditCollectionDialogOpen.use()
  const routeEntityId = $ui.routeEntityId.use()

  return (
    <>
      {isEditCollectionDialogOpen && (
        <EditCollectionDialog collectionId={routeEntityId} handleClose={() => $ui.isEditCollectionDialogOpen.set(false)} />
      )}
      {isCreateCollectionDialogOpen && <CreateCollectionDialog handleClose={() => $ui.isCreateCollectionDialogOpen.set(false)} />}
    </>
  )
}

const AppFrame = () => {
  useRoutingSync()
  const classNames = useAppFrameClassNames()

  const folders = $folders.list.use()
  const isSetupDone = $ui.isSetupDone.use()
  if (!isSetupDone) return <MainLoader />
  const content = !folders.length ? <NoFoldersView /> : <Router />

  return (
    <Flex className={classNames} height="100vh" gap="4">
      <Sidebar />
      {content}
    </Flex>
  )
}

const useAppFrameClassNames = () => {
  const isCompactView = $ui.isCompactViewEnabled.use()
  const isAddingAssetToCollection = $ui.isAddingToCollection.use()
  const addingToCollectionClassName = isAddingAssetToCollection ? 'isAddingSampleToCollection' : ''
  const isCompactViewClassName = isCompactView ? 'isCompactView' : ''
  return clsx('App', 'AppFrame', addingToCollectionClassName, isCompactViewClassName)
}

const MainLoader = () => {
  return (
    <Flex className="App" flex="1" justify="center" align="center" fullH>
      <VStack colorPalette="teal" fullW fullH>
        <Spinner size="xl" />
        <Text>Loading...</Text>
      </VStack>
    </Flex>
  )
}
