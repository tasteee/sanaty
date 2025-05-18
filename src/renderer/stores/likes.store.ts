import { datass } from 'datass'

class LikesStore {
  store = datass.array([])

  load = async () => {
    const newList = await window.electron.getAllLikes()
    this.store.set(newList)
  }

  toggle = async (id) => {
    await window.electron.toggleLiked(id)
    await this.load()
  }

  useIsLiked = (id) => {
    return this.store.use((ids) => ids.includes(id))
  }
}

export const $likes = new LikesStore()
globalThis.$likes = $likes
