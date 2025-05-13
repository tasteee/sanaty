import { datass } from 'datass'
import { _store } from '#/modules/_stores'
import { makeGlobal } from '#/modules/_global'

type ErrorDataT = {
  id: string
  message: string
  date: number
}

class ErrorsStore {
  history = datass.array<ErrorDataT>([])

  filesystem = datass.object({
    missingFolders: [],
    missingSamples: [],
    missingFolderIds: [],
    missingSampleIds: []
  })

  report(message) {
    const date = Date.now()
    const id = crypto.randomUUID()
    const errorData = { id, message, date }
    this.history.set.append(errorData)
  }
}

export const $errors = new ErrorsStore()
makeGlobal('errors', $errors)
