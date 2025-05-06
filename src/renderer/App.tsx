import './index.css'
import { Route, Switch } from 'wouter'
import { Sidebar } from '#/components/Sidebar'
import { Provider, Flex } from '#/components'
import { SearchFilterSection } from '#/components/SearchFilterSection'
import { SortOptionsRow } from './components/SearchFilterSection/SortOptionsRow'
import { AssetResultsList } from './components/AssetResultsList/AssetResultsList'
import React from 'react'
import { $assets } from './stores/assets'

const getAppData = async () => {
  const appData = await window.electron.getAppData()
  console.log({ appData })
  $assets.list.set(appData.assets)
}

export function App() {
  return (
    <Provider>
      <Dashboard />
    </Provider>
  )
}

const Dashboard = () => {
  React.useEffect(() => {
    getAppData()
  }, [])

  return (
    <Flex className="App" height="100vh" gap="4">
      <Sidebar />
      <Flex direction="column" gap="2" flex="1" overflow="hidden">
        <SearchFilterSection />
        <SortOptionsRow />
        {/* Make this grow and enable scrolling inside */}
        <Flex direction="column" flex="1" overflow="hidden" pb="24px">
          <AssetResultsList />
        </Flex>
      </Flex>
    </Flex>
  )
}

// const Router = () => {
//   return (
//     <Switch>
//       <Route path="/" component={ExploreView} />
//       <Route path="/settings" component={ExploreView} />
//       <Route path="/support" component={ExploreView} />
//       <Route path="/collections/:username/:collectionName" component={ExploreView} />
//     </Switch>
//   )
// }
