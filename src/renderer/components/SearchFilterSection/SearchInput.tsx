import './SearchInput.css'
import { InputGroup, Input, CuteIcon } from '#/components'
import { $search } from '#/stores/search.store'

const SearchIcon = <CuteIcon name="search-2" />

export const SearchInput = () => {
  const value = $search.value.use()

  const onChange = (event: any) => {
    $search.setSearchValue(event.target.value)
  }

  return (
    <InputGroup className="SearchInput" flex="1" startElement={SearchIcon}>
      <Input size="xs" placeholder="Search" value={value} onChange={onChange} />
    </InputGroup>
  )
}
