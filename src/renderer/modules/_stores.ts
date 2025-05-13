const NOOP = (arg) => arg
const getNotUndefined = (a, b) => (typeof a === 'undefined' ? b : a)
const createSetter = (target) => (key) => (value) => target.set({ [key]: value })

const createKeyHook = (target) => {
  return (key) => {
    const useKeyHook = (modifier = NOOP) => {
      return target.use((value) => modifier(value[key]))
    }

    return useKeyHook
  }
}

const createToggler = (target) => {
  return (key) => (value?: boolean) => {
    return target.set({ [key]: !!getNotUndefined(value, !target.state[key]) })
  }
}

export const _store = (target) => {
  return {
    createSetter: createSetter(target),
    createToggler: createToggler(target),
    createKeyHook: createKeyHook(target)
  }
}
