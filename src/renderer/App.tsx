import './index.css'
import { Redirect, Route, Switch, useLocation, useParams, useSearch } from 'wouter'
import { Sidebar } from '#/components/Sidebar'
import { Provider, Flex, Toaster, VStack, Spinner, Text } from '#/components'
import { SearchFilterSection } from '#/components/views/SamplesResultsView/SearchFilterSection'
import { SampleResultsList } from './components/views/SamplesResultsView/AssetResultsList/AssetResultsList'
import { $folders } from './stores/folders'
import { NoFoldersView } from './components/NoFoldersView'
import { ViewBox } from './components/ui/ViewBox'
import React from 'react'
import { $main, $routing } from './stores/main'
import { $collections } from './stores/collections'
import { HomeView } from './components/views/HomeView/HomeView'
import { PlaybackBar } from './components/views/SamplesResultsView/PlaybackBar/PlaybackBar'
import { SamplesResultsView } from './components/views/SamplesResultsView/SamplesResultsView'
import { $likes } from './stores/likes'
import { CollectionView } from './components/views/CollectionsView/CollectionsView'
import { FolderView } from './components/views/FoldersView/FolderView'
import { editCollectionDialog } from './components/Sidebar/EditCollectionDialog'
import { createCollectionDialog } from './components/Sidebar/CreateCollectionDialog'
import { Router } from './Router'

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
  ;(async () => {
    await $folders.reloadFolders()
    await $collections.reload()
    await $likes.reload()
    await $main.verifyFoldersAndSamples()
    console.clear()
    console.log('[sanaty] setup done')
    $main.isSetupDone.set(true)
  })()
}

const AppFrame = () => {
  const folders = $folders.list.use()
  const isSetupDone = $main.isSetupDone.use()
  React.useEffect(setupAppData, [])
  if (!isSetupDone) return <MainLoader />
  const content = !folders.length ? <NoFoldersView /> : <Router />

  return (
    <AppDiv>
      <Sidebar />
      {content}
    </AppDiv>
  )
}

const AppDiv = (props) => <Flex className="App" height="100vh" gap="4" {...props} />

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
