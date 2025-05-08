import { TAGS } from '#/constants'
import { datass } from 'datass'

// All tags in the DB.
const $list = datass.array<TagT>(TAGS)

const updateTags = (newTags: TagT[]) => {
  $list.set(newTags)
}

const getTag = (id: string) => {
  return $list.state.find((tag) => tag._id === id)
}

export const $tags = {
  list: $list,
  updateTags,
  getTag
}
