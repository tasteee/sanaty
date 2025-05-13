import { ButtonGroup, IconButton, Pagination } from '@chakra-ui/react'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'
import { $search } from '#/stores/search.store'

export const Paginator = () => {
  const currentPage = $search.usePaginationCurrentPage()
  const itemsPerPage = $search.usePaginationItemsPerPage()
  const itemsCount = $search.results.use((state) => state.all.length)

  const onPageChange = (event) => {
    $search.goToPage(event.page)
  }

  return (
    <Pagination.Root count={itemsCount} pageSize={itemsPerPage} page={currentPage} onPageChange={onPageChange}>
      <ButtonGroup variant="ghost" size="sm">
        <Pagination.PrevTrigger asChild>
          <IconButton>
            <LuChevronLeft />
          </IconButton>
        </Pagination.PrevTrigger>

        <Pagination.Items render={(page) => <IconButton variant={{ base: 'ghost', _selected: 'outline' }}>{page.value}</IconButton>} />

        <Pagination.NextTrigger asChild>
          <IconButton>
            <LuChevronRight />
          </IconButton>
        </Pagination.NextTrigger>
      </ButtonGroup>
    </Pagination.Root>
  )
}
