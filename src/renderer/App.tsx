import './index.css'
import { Redirect, Route, Switch } from 'wouter'
import { Sidebar } from '#/components/Sidebar'
import { Provider, Flex, Toaster, VStack, Spinner, Text } from '#/components'
import { SearchFilterSection } from '#/components/views/SamplesView/SearchFilterSection'
import { SampleResultsList } from './components/views/SamplesView/AssetResultsList/AssetResultsList'
import { $folders } from './stores/folders'
import { NoFoldersView } from './components/NoFoldersView'
import { ViewBox } from './components/ui/ViewBox'
import React from 'react'
import { $main } from './stores/main'
import { $collections } from './stores/collections'
import { HomeView } from './components/views/HomeView/HomeView'
import { PlaybackBar } from './components/views/SamplesView/PlaybackBar/PlaybackBar'

export function App() {
  return (
    <Provider>
      <AppFrame />
      <Toaster />
    </Provider>
  )
}

const setupAppData = async () => {
  await $folders.reloadFolders()
  await $collections.reload()
  console.log('[sanaty] setup done')
  $main.isSetupDone.set(true)
}

const AppFrame = () => {
  const folders = $folders.list.use()
  const isSetupDone = $main.isSetupDone.use()

  React.useEffect(() => {
    setupAppData()
  }, [])

  if (!isSetupDone) {
    return (
      <Flex className="App" flex="1" justify="center" align="center" fullH>
        <VStack colorPalette="teal" fullW fullH>
          <Spinner size="xl" />
          <Text>Loading...</Text>
        </VStack>
      </Flex>
    )
  }

  return (
    <Flex className="App" height="100vh" gap="4">
      <Sidebar />
      {!folders.length ? <NoFoldersView /> : <Router />}
    </Flex>
  )
}

const Router = () => {
  return (
    <Switch>
      <Route path="/" component={HomeView} />
      <Route path="/index.html" component={() => <Redirect to="/" />} />
      <Route path="/samples" component={SamplesView} />
      <Route path="/collection/:collectionId" component={CollectionView} />
    </Switch>
  )
}

const SamplesView = () => {
  // TODO: On mount, get 500 samples from the database for SampleResultsList to render.
  return (
    <ViewBox id="SamplesView">
      <SearchFilterSection />
      <SampleResultsList />
      <PlaybackBar />
    </ViewBox>
  )
}

const CollectionView = () => {
  // TODO: On mount, get collection samples from the database for SampleResultsList to render.
  return (
    <ViewBox id="CollectionsView">
      <SearchFilterSection />
      <SampleResultsList />
    </ViewBox>
  )
}
