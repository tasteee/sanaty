import { datass } from 'datass'

const $list = datass.array<string>([])

async function reload() {
  const newList = await window.electron.getAllLikes()
  $list.set(newList)
}

async function toggleLike(sampleId: string) {
  await window.electron.toggleAssetLiked(sampleId)
  await reload()
}

function useIsLiked(id: string) {
  return $list.use((ids) => ids.includes(id))
}

export const $likes = {
  list: $list,
  toggleLike,
  reload,
  useIsLiked
}

globalThis.$likes = $likes
