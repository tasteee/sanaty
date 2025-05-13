import { Switch, Route, Redirect, useRoute, useLocation } from 'wouter'
import { CollectionView } from './components/views/CollectionsView/CollectionsView'
import { FolderView } from './components/views/FoldersView/FolderView'
import { HomeView } from './components/views/HomeView/HomeView'
import { SamplesResultsView } from './components/views/SamplesResultsView/SamplesResultsView'
import { Router as Wouter, useParams } from 'wouter'
import React from 'react'
import { $search } from './stores/search.store'
import { SamplesView } from './components/views/SamplesView'

export const Router = () => {
  return (
    <>
      <Wouter>
        <Switch>
          <Route path="/" component={HomeView} />
          <Route path="/index.html" component={() => <Redirect to="/" />} />
          <Route path="/samples" component={SamplesView} />
          <Route path="/collections/collection/:id" component={CollectionView} />
          <Route path="/folders/folder/:id" component={FolderView} />
          <Route path="/folders" component={HomeView} />
          {/* <Route path="/collections" component={CollectionsView} /> */}
        </Switch>
        {/* <RouteWatcher /> */}
      </Wouter>
    </>
  )
}

const RouteWatcher = () => {
  const params = useParams()
  const [isCollectionPath] = useRoute('/collections')
  const [isFolderPath] = useRoute('/folders')
  const idParam = params.id
  const [location] = useLocation()

  React.useEffect(() => {
    console.log('Router', { params, location, idParam, isCollectionPath, isFolderPath })
    if (!idParam) return
    if (!isCollectionPath && !isFolderPath) return
    const key = isCollectionPath ? 'collectionId' : 'folderId'
    $search.filters.set.reset()
    $search.results.set.reset()
    $search.pagination.set.reset()
    $search.filters.set({ [key]: idParam })
    $search.searchSamples()
  }, [idParam, isCollectionPath, isFolderPath, location])

  return null
}
