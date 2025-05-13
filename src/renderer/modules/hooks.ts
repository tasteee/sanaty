import { $ui } from '#/stores/ui.store'
import { useRoute } from 'wouter'

export const useRouteParamId = (path) => {
  const route = useRoute(path)
  const params = route[1] as any
  if (params) $ui.routeParamId.set(params.id)
  return params ? params.id : ''
}
