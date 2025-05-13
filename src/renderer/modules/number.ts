export const parseToNumber = (value: string | number) => {
  return typeof value === 'number' ? value : parseInt(value)
}

export const _number = (target: any) => {
  return {
    parseToNumber: () => parseToNumber(target),
    clamp: (min, max) => Math.min(Math.max(target, min), max)
  }
}
