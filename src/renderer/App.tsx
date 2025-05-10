import './index.css'
import { Redirect, Route, Switch, useLocation, useParams, useSearch } from 'wouter'
import { Sidebar } from '#/components/Sidebar'
import { Provider, Flex, Toaster, VStack, Spinner, Text } from '#/components'
import { SearchFilterSection } from '#/components/views/SamplesView/SearchFilterSection'
import { SampleResultsList } from './components/views/SamplesView/AssetResultsList/AssetResultsList'
import { $folders } from './stores/folders'
import { NoFoldersView } from './components/NoFoldersView'
import { ViewBox } from './components/ui/ViewBox'
import React from 'react'
import { $main, $routing } from './stores/main'
import { $collections } from './stores/collections'
import { HomeView } from './components/views/HomeView/HomeView'
import { PlaybackBar } from './components/views/SamplesView/PlaybackBar/PlaybackBar'
import { SamplesView } from './components/views/SamplesView/SamplesView'
import { $likes } from './stores/likes'
import { CollectionView, FolderView } from './components/views/CollectionsView/CollectionsView'

export function App() {
  return (
    <Provider>
      <AppFrame />
      <Toaster />
      <RouterStateSync />
    </Provider>
  )
}

const setupAppData = async () => {
  await $folders.reloadFolders()
  await $collections.reload()
  await $likes.reload()
  await $main.verifyFoldersAndSamples()
  console.clear()
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

      <Route path="/collections/collection/:collectionId" component={CollectionView} />
      {/* <Route path="/collections" component={CollectionsView} /> */}

      <Route path="/folders/folder/:folderId" component={FolderView} />
      <Route path="/folders" component={HomeView} />
    </Switch>
  )
}

const RouterStateSync = React.memo(() => {
  const [location] = useLocation()
  const params = useParams()
  const search = useSearch()
  console.log({ location, params, search })

  React.useEffect(() => {
    $routing.set({ location, params, search })
  }, [location, params, search])
  return null
})
