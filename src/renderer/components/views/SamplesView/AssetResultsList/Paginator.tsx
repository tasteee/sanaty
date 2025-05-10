import { ButtonGroup, IconButton, Pagination } from '@chakra-ui/react'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'
import { $pagination, $samplesViewStore } from '../samplesView.store'

export const Paginator = () => {
  const currentPage = $pagination.currentPage.use()
  const itemsPerPage = $pagination.itemsPerPage.use()
  const itemsCount = $samplesViewStore.results.use((list) => list.length)

  const onPageChange = (event) => {
    console.log('going to page... ', event.page)
    $pagination.goToPage(event.page)
  }

  return (
    <Pagination.Root count={itemsCount} pageSize={itemsPerPage} page={currentPage} onPageChange={onPageChange}>
      <ButtonGroup variant="ghost" size="sm">
        <Pagination.PrevTrigger asChild>
          <IconButton>
            <LuChevronLeft />
          </IconButton>
        </Pagination.PrevTrigger>

        <Pagination.Items
          render={(page) => <IconButton variant={{ base: 'ghost', _selected: 'outline' }}>{page.value}</IconButton>}
        />

        <Pagination.NextTrigger asChild>
          <IconButton>
            <LuChevronRight />
          </IconButton>
        </Pagination.NextTrigger>
      </ButtonGroup>
    </Pagination.Root>
  )
}
