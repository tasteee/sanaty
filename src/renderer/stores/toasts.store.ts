import { TOAST_CONFIGS } from '#/constants/toasts'
import { removeById } from '#/modules/list'
import { datass } from 'datass'
import safeGet from 'just-safe-get'

class ToastsStore {
  list = datass.array([])

  open = (configPath) => {
    const id = crypto.randomUUID()
    const toastConfig = safeGet(TOAST_CONFIGS, configPath)
    const fullConfig = { id, ...toastConfig }
    this.list.set.append(fullConfig)

    setTimeout(() => {
      this.close(id)
    }, fullConfig.duration)

    return id
  }

  close = (id) => {
    const newList = removeById(this.list.state, id)
    this.list.set(newList)
  }
}

export const $toasts = new ToastsStore()
globalThis.$toasts = $toasts
