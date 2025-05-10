export const parseToNumber = (value: string | number) => {
  return typeof value === 'number' ? value : parseInt(value)
}

export const _number = (target: any) => {
  return {
    parseToNumber: () => parseToNumber(target)
  }
}
