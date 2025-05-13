import { $ui } from '#/stores/ui.store'
import React from 'react'
import { useRoute } from 'wouter'

export const useRouteParamId = (path) => {
  // const route = useRoute(path)
  // const params = route[1] as any
  // if (params) $ui.routeParamId.set(params.id)
  // return params ? params.id : ''
}

export const useDeferredRender = (pageResults) => {
  const [isReady, setIsReady] = React.useState(false)

  React.useEffect(() => {
    if (!pageResults.length) return

    setTimeout(() => {
      setIsReady(true)
    }, 250)
  }, [pageResults])

  return isReady
}
