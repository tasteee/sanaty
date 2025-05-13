import { createSuccessResponse } from '../helpers'
import { $likes } from '../setup'

export function toggleLiked(id: string) {
  const match = $likes.queryById(id)
  const isCurrentlyLiked = !!match

  if (!isCurrentlyLiked) {
    $likes.state = [...$likes.state, { id }]
    return createSuccessResponse({ isNowLiked: true })
  }

  const withSampleIdRemoved = $likes.state.filter((id) => id !== id)
  $likes.state = withSampleIdRemoved
  return createSuccessResponse({ isNowLiked: false })
}
