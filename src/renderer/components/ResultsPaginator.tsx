import { Pagination } from '@mantine/core'
import { $search } from '#/stores/search.store'

export const ResultsPaginator = () => {
  const currentPage = $search.usePaginationCurrentPage()
  const totalPages = $search.usePaginationTotalPages()

  const onPageChange = (page) => {
    console.log(page)
    $search.goToPage(page)
  }

  return <Pagination className="ResultsPaginator" value={currentPage} onChange={onPageChange} total={totalPages} />
}
