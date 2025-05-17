export const getKey = (event: KeyboardEvent) => {
  const key = event.key.toLowerCase()
  return key === ' ' ? 'space' : key
}
