import './index.css'
import '#/modules/_global'
import React from 'react'
import { Sidebar } from '#/components/Sidebar'
import { Provider, Flex, Toaster, VStack, Spinner, Text } from '#/components'
import { $folders } from './stores/folders.store'
import { NoFoldersView } from './components/NoFoldersView'
import { $collections } from './stores/collections.store'
import { $likes } from './stores/likes.store'
import { editCollectionDialog } from './components/Sidebar/EditCollectionDialog'
import { createCollectionDialog } from './components/Sidebar/CreateCollectionDialog'
import { Router } from './Router'
import { $ui } from './stores/ui.store'

export function App() {
  return (
    <Provider>
      <AppFrame />
      <Toaster />
      <Overlays />
    </Provider>
  )
}

const Overlays = () => {
  return (
    <>
      <editCollectionDialog.Viewport />
      <createCollectionDialog.Viewport />
    </>
  )
}

const setupAppData = () => {
  const a = $folders.load()
  const b = $collections.load()
  const c = $likes.load()

  Promise.all([a, b, c]).then(() => {
    console.clear()
    console.log('[sanaty] setup done')
    $ui.isSetupDone.set(true)
  })
}

const AppFrame = () => {
  React.useEffect(() => setupAppData(), [])

  const folders = $folders.list.use()
  const isSetupDone = $ui.isSetupDone.use()
  if (!isSetupDone) return <MainLoader />
  const content = !folders.length ? <NoFoldersView /> : <Router />

  return (
    <Flex className="App" height="100vh" gap="4">
      <Sidebar />
      {content}
    </Flex>
  )
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
