import { CuteIcon } from '#/components'
import { $search } from '#/stores/search.store'
import { Input } from '@mantine/core'

const searchIcon = <CuteIcon name="search-2" size="md" color="#71717a" />

export const SearchInput = () => {
  const value = $search.filters.use((state) => state.searchValue)

  const clearValue = () => {
    $search.filters.set({ searchValue: '' })
  }

  const onChange = (event: any) => {
    $search.filters.set({ searchValue: event.target.value })
  }

  const getRightSection = () => {
    if (value) return <Input.ClearButton onClick={clearValue} />
    return null
  }

  return (
    <Input
      value={value}
      placeholder="Search"
      onChange={onChange}
      leftSection={searchIcon}
      rightSection={getRightSection()}
      rightSectionPointerEvents="auto"
      size="sm"
    />
  )
}
