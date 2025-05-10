import { Switch, Route, Redirect } from 'wouter'
import { CollectionView } from './components/views/CollectionsView/CollectionsView'
import { FolderView } from './components/views/FoldersView/FolderView'
import { HomeView } from './components/views/HomeView/HomeView'
import { SamplesResultsView } from './components/views/SamplesResultsView/SamplesResultsView'

export const Router = () => {
  return (
    <Switch>
      <Route path="/" component={HomeView} />
      <Route path="/index.html" component={() => <Redirect to="/" />} />

      <Route path="/samples" component={SamplesResultsView} />

      <Route path="/collections/collection/:collectionId" component={CollectionView} />
      {/* <Route path="/collections" component={CollectionsView} /> */}

      <Route path="/folders/folder/:folderId" component={FolderView} />
      <Route path="/folders" component={HomeView} />
    </Switch>
  )
}
