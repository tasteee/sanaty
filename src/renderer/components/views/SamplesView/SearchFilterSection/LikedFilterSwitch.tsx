import { CuteIcon, IconButton, Switch } from '#/components'
import { $samplesViewStore } from '../samplesView.store'

export const LikedFilterSwitch = () => {
  const isActive = $samplesViewStore.filters.use((state) => state.isLiked)
  const iconName = isActive ? 'bxs:heart' : 'bx:heart'
  const color = isActive ? '#ec4899' : '#71717a'
  const scale = isActive ? 1.25 : 1.1
  const style = { scale }

  const handleClick = (event) => {
    event.stopPropagation()
    $samplesViewStore.filters.set({ isLiked: event.checked })
  }

  return (
    <IconButton onMouseUp={handleClick} variant="outline">
      <CuteIcon customIcon={iconName} color={color} style={style} />
    </IconButton>
  )
}
