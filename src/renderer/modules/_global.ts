global.app = global.app || {}

const prepareGlobalApp = () => {
  const app = globalThis.app
  if (!app) globalThis.app = {}
  return globalThis
}

export const makeGlobal = (key, value) => {
  prepareGlobalApp()
  globalThis.app[key] = value
}
