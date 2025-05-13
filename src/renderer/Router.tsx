import { Switch, Route, Redirect, useRoute, useLocation } from 'wouter'
import { CollectionsView } from './components/views/CollectionsView/CollectionsView'
import { FolderView } from './components/views/FoldersView/FolderView'
import { HomeView } from './components/views/HomeView/HomeView'
import { Router as Wouter, useParams } from 'wouter'
import { SamplesView } from './components/views/SamplesView'
import { CollectionView } from './components/views/CollectionsView/CollectionView'

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
          <Route path="/collections" component={CollectionsView} />
        </Switch>
      </Wouter>
    </>
  )
}
