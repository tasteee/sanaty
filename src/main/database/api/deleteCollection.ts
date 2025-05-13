import { $collections } from '../setup'

export function deleteCollection(id: string) {
  $collections.queryRemove(id)
}
