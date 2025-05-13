import { makeGlobal } from '#/modules/_global'
import { datass } from 'datass'

class FoldersStore {
  list = datass.array<FolderT>([])

  load = async () => {
    const allFolders = await window.electron.getAllFolders()
    this.list.set(allFolders)
  }

  add = async () => {
    await window.electron.addFolder()
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
    return this.list.use((folders) => {
      return folders.find((folder) => folder.id === id)
    })
  }
}

export const $folders = new FoldersStore()
makeGlobal('folders', $folders)
