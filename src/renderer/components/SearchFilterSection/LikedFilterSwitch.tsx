import { CuteIcon, IconButton, Switch } from '#/components'
import { $search } from '#/stores/search.store'

export const LikedFilterSwitch = () => {
  const isActive = $search.filters.use((state) => state.isLiked)
  const iconName = isActive ? 'bxs:heart' : 'bx:heart'
  const color = isActive ? '#ec4899' : '#71717a'
  const scale = isActive ? 1.25 : 1.1
  const style = { scale }

  const handleClick = (event) => {
    event.stopPropagation()
    $search.filters.set({ isLiked: event.checked })
  }

  return (
    <IconButton className="LikedFilterSwitch" onMouseUp={handleClick} variant="outline" size="md" style={{ height: 40 }}>
      <CuteIcon customIcon={iconName} color={color} style={style} />
    </IconButton>
  )
}
