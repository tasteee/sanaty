import { datass } from 'datass'

export const $user = datass.object<UserT>({
  _id: '12354',
  username: 'tasteink',
  email: 'taste@taste.ink',
  avatarUrl: '',
  description: 'its me',
  favoritedAssets: [],
  collections: [],
  packs: [],
  createdDate: Date.now(),
  updatedDate: Date.now()
})
