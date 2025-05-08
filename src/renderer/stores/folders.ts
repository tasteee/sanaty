import { datass } from 'datass'

const $list = datass.array<FolderT>([])

const reloadFolders = async () => {
  const allFolders = await window.electron.getAllFolders()
  $list.set(allFolders)
}

const addFolder = async () => {
  await window.electron.addFolder()
  await reloadFolders()
}

const getFolderSampleCount = async (id: string) => {
  return await window.electron.getFolderSampleCount(id)
}

const removeFolder = async (folderId: string) => {
  await window.electron.removeFolder(folderId)
  await reloadFolders()
}

const refreshFolder = async (id: string) => {
  await window.electron.refreshFolder(id)
  await reloadFolders()
}

const getFolder = (id: string) => {
  return $list.state.find((folder) => folder._id === id)
}

const useFolder = (id: string) => {
  return $list.use((folders) => folders.find((item) => item._id === id)) as FolderT
}

export const $folders = {
  list: $list,
  addFolder,
  removeFolder,
  reloadFolders,
  refreshFolder,
  getFolder,
  getFolderSampleCount,
  useFolder
}
