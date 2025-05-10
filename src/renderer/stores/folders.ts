import { datass } from 'datass'
import memoize from 'memoize'
import { $main } from './main'

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
  await $main.verifyFoldersAndSamples()
}

const getFolder = (id: string) => {
  return $list.state.find((folder) => folder._id === id) as FolderT
}

const getFolderArtwork = memoize((id: string) => {
  const folder = getFolder(id)
  return folder.artworkUrl || 'https://placehold.co/400'
})

const useFolder = (id: string) => {
  return $list.use((folders) => folders.find((item) => item._id === id)) as FolderT
}

export const $folders = {
  list: $list,
  addFolder,
  removeFolder,
  reloadFolders,
  getFolderArtwork,
  refreshFolder,
  getFolder,
  getFolderSampleCount,
  useFolder
}

globalThis.$folders = $folders
