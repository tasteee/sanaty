import { datass } from 'datass'

const $list = datass.array([])

const getAssetById = (id: string) => {
  return $list.state.find((item) => item.id === id)
}

const updateAssetById = (id: string, updater) => {
  const newList = $list.state.map((item) => {
    if (item.id !== id) return item
    return updater(item)
  })

  $list.set(newList)
}

const useAsset = (id: string) => {
  return $list.use.find((item) => item.id === id)
}

const setAssetLiked = (id: string, isLiked: boolean) => {
  updateAssetById(id, (asset) => {
    return { ...asset, isLiked }
  })
}

export const $assets = {
  list: $list,
  useAsset,
  updateAssetById,
  getAssetById,
  setAssetLiked
}
