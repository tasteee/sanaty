import { makeGlobal } from '#/modules/_global'
import { datass } from 'datass'

class FoldersStore {
  list = datass.array<FolderT>([])

  load = async () => {
    const allFolders = await window.electron.getAllFolders()
    console.log('LOAD ', allFolders)
    this.list.set(allFolders)
  }

  add = async () => {
    await window.electron.addFolder()
    console.log('ADDED FOLDER')
    this.load()
  }

  remove = async (id) => {
    await window.electron.removeFolder(id)
    await this.load()
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
