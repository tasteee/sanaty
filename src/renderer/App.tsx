import './index.css'
import './styles/general.css'
import '@mantine/notifications/styles.css'

import { Provider } from '#/components/Provider'
import { Flex, Toaster, VStack, Spinner, Text } from '#/components'
import { $folders } from './stores/folders.store'
import { NoFoldersView } from './components/NoFoldersView'
import { Router } from './components/Router'
import { $ui } from './stores/ui.store'
import { useRoutingSync } from './modules/useRoutingSync'
import { useMount } from '@siberiacancode/reactuse'
import { setupAppData } from './modules/appSetup'
import { LoadingOverlay } from './components/LoadingOverlay'
import { Notifications } from '@mantine/notifications'
import { NavBar } from './components/NavBar'
import { PlaybackHandler } from './components/PlaybackHandler'
import clsx from 'clsx'

export const App = () => {
  useMount(setupAppData)

  return (
    <Provider>
      <AppFrame />
      <PlaybackHandler />
      <Toaster />
      <LoadingOverlay />
      <Notifications />
    </Provider>
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
    <Flex className={classNames} height="100vh">
      <NavBar />
      {content}
    </Flex>
  )
}

const useAppFrameClassNames = () => {
  const isDragging = $ui.isDragging.use()
  const isCompactView = $ui.isCompactViewEnabled.use()
  const isCompactViewClassName = isCompactView ? 'isCompactView' : ''
  const isDraggingClassName = isDragging ? 'isDragging' : ''
  return clsx('App', 'AppFrame', isCompactViewClassName, isDraggingClassName)
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
