import './SearchInput.css'
import { InputGroup, Input, CuteIcon, Button } from '#/components'
import { $samplesViewStore } from '../samplesView.store'

const SearchIcon = <CuteIcon name="search-2" size="md" />

export const SearchInput = () => {
  const value = $samplesViewStore.filters.use((state) => state.searchValue)

  const onChange = (event: any) => {
    $samplesViewStore.filters.set({ searchValue: event.target.value })
  }

  return (
    <InputGroup className="SearchInput" flex="1" startElement={SearchIcon}>
      <Input size="xs" placeholder="Search" value={value} onChange={onChange} colorPalette="pink" />
    </InputGroup>
  )
}
