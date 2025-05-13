// src/renderer/stores/ui.ts
import { makeGlobal } from '#/modules/_global'
import { _store } from '#/modules/_stores'
import { datass } from 'datass'
import { $search } from './search.store'

type LoaderConfigT = {
  id: string
  message: string
  isCancelable?: boolean
  cancel?: () => void
}

const LOADERS = {
  isLoadingView: { id: 'isLoadingView', message: 'isLoadingView' },
  loadingFolders: { id: 'loadingFolders', message: 'loadingFolders' },
  removingFolder: { id: 'removingFolder', message: 'removingFolder' },
  refreshingFolder: { id: 'refreshingFolder', message: 'refreshingFolder' },
  indexingFolder: { id: 'indexingFolder', message: 'indexingFolder' },
  loadingSamples: { id: 'loadingSamples', message: 'loadingSamples' },
  likingSample: { id: 'likingSample', message: 'likingSample' },
  unlikingSample: { id: 'unlikingSample', message: 'unlikingSample' },
  loadingCollections: { id: 'loadingCollections', message: 'loadingCollections' },
  creatingCollection: { id: 'creatingCollection', message: 'creatingCollection' },
  savingCollection: { id: 'savingCollection', message: 'savingCollection' },
  deletingCollection: { id: 'deletingCollection', message: 'deletingCollection' },
  addingSampleToCollection: { id: 'addingSampleToCollection', message: 'addingSampleToCollection' },
  removingSampleFromCollection: { id: 'removingSampleFromCollection', message: 'removingSampleFromCollection' }
}

class LoadersStore {
  isLoading = datass.boolean(false)
  isLoadingView = datass.boolean(false)
  activeLoaders = datass.array<LoaderConfigT>([])

  start(id: string) {
    const ids = this.activeLoaders.state.map((loader) => loader.id)
    const isAlreadyActive = ids.includes(id)
    if (isAlreadyActive) return
    const config = LOADERS[id]
    this.activeLoaders.set.append(config)
  }

  stop(id: string) {
    const newLoaders = this.activeLoaders.state.filter((loader) => loader.id !== id)
    this.activeLoaders.set(newLoaders)
  }
}

export const $loaders = new LoadersStore()
makeGlobal('loaders', $loaders)

// When activeLoaders updates, set isLoading accordingly.
$loaders.activeLoaders.watch(() => {
  const isLoadingView = $loaders.activeLoaders.state.some((loader) => loader.id === 'isLoadingView')
  const isLoading = !!$loaders.activeLoaders.state.length
  $loaders.isLoading.set(isLoading)
  $loaders.isLoadingView.set(isLoadingView)
})
