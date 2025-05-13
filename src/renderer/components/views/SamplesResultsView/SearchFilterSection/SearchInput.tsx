import './SearchInput.css'
import { InputGroup, Input, CuteIcon, Button } from '#/components'
import { $search } from '#/stores/search.store'

const SearchIcon = <CuteIcon name="search-2" size="md" color="#71717a" />

export const SearchInput = () => {
  const value = $search.filters.use((state) => state.searchValue)

  const onChange = (event: any) => {
    $search.filters.set({ searchValue: event.target.value })
  }

  return (
    <InputGroup className="SearchInput" flex="1" startElement={SearchIcon}>
      <Input size="md" variant="outline" placeholder="Search" value={value} onChange={onChange} />
    </InputGroup>
  )
}
