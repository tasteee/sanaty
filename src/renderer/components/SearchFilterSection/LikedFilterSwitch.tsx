import { Switch } from '#/components'
import { $filters } from '#/stores/search.store'

export const LikedFilterSwitch = () => {
  const isActive = $filters.isLikedFilterActive.use()

  const onChange = (event: any) => {
    $filters.isLikedFilterActive.set(event.checked)
  }

  return (
    <Switch.Root colorPalette="pink" size="md" checked={isActive} onCheckedChange={onChange}>
      <Switch.HiddenInput />
      <Switch.Control />
      <Switch.Label>Liked</Switch.Label>
    </Switch.Root>
  )
}
