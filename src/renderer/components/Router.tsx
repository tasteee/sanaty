import { Switch, Route, Redirect, useRoute, useLocation } from 'wouter'
import { CollectionsView } from './CollectionsView'
import { FolderView } from './FolderView'
import { FoldersView } from './FoldersView'
import { Router as Wouter } from 'wouter'
import { SamplesView } from './SamplesView'
import { CollectionView } from './CollectionView'

export const Router = () => {
  return (
    <>
      <Wouter>
        <Switch>
          <Route path="/" component={SamplesView} />
          <Route path="/index.html" component={() => <Redirect to="/" />} />
          <Route path="/samples" component={SamplesView} />
          <Route path="/collections/collection/:id" component={CollectionView} />
          <Route path="/folders/folder/:id" component={FolderView} />
          <Route path="/folders" component={FoldersView} />
          <Route path="/collections" component={CollectionsView} />
        </Switch>
      </Wouter>
    </>
  )
}
