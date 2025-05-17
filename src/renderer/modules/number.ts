export const _number = (target: any) => {
  return {
    parseToNumber: () => toNumber(target),
    clamp: (min, max) => Math.min(Math.max(target, min), max)
  }
}

export const toNumber = (value: string | number) => {
  return typeof value === 'number' ? value : parseInt(value)
}

export const createClamp = (min, max) => (value) => {
  if (value < min) return min
  if (value > max) return max
  return value
}
