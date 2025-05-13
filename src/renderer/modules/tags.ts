import { TAGS } from '#/constants/tags'

const getTagObjectById = (id: string) => {
  return TAGS.MAP[id] as TagT
}

const categorizeTags = (tags: TagT[]) => {
  const target = { genre: [], instrument: [], descriptor: [] }
  return tags.reduce((final, tag: TagT) => {
    final[tag.category].push(tag)
    return final
  }, target)
}

export const _tags = {
  getTagObjectById, // _tags.getTagObjectById('foo-bar')
  categorizeTags // _tags.categorizeTags([tag0, tag1, tag2])
}
