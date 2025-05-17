import { datass } from 'datass'
import { $collections } from './collections.store'
import { $ui } from './ui.store'

class FoldersStore {
  list = datass.array<FolderT>([])

  load = async () => {
    const allFolders = await window.electron.getAllFolders()
    this.list.set(allFolders)
  }

  add = async () => {
    $ui.isIndexingFolder.set(true)
    await window.electron.addFolder()
    $ui.isIndexingFolder.set(false)
    this.load()
  }

  remove = async (id) => {
    await window.electron.removeFolder(id)
    await this.load()
    $collections.load()
  }

  refresh = async (id) => {
    await window.electron.refreshFolder(id)
    await this.load()
  }

  useFolder = (id) => {
    const allFolders = this.list.use()
    return allFolders.find((folder) => folder.id === id)
  }
}

export const $folders = new FoldersStore()
globalThis.folders = $folders
