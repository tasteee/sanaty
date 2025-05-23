import { $ui } from '#/stores/ui.store'
import React from 'react'
import { useLocation, useParams, useRoute, useRouter } from 'wouter'

const useSearchableViewActiveSync = () => {
  const [location] = useLocation()

  React.useEffect(() => {
    const isSamples = location.startsWith('/samples')
    const isFolder = location.startsWith('/folders/folder')
    const isCollection = location.startsWith('/collections/collection')
    if (isSamples || isCollection || isFolder) $ui.isSearchableViewActive.set(true)
  }, [location])
}

export function useRoutingSync() {
  useSearchableViewActiveSync()

  const [isCollectionPath, collectionPathRest] = useRoute('/collections/collection/*?')
  const [isFolderPath, folderPathRest] = useRoute('/folders/folder/*?')

  const params = useParams() as any
  const collectionPathRestId = (collectionPathRest as any)?.[0]
  const folderPathRestId = (folderPathRest as any)?.[0]
  const idParam = params.id || params[0] || collectionPathRestId || folderPathRestId

  React.useEffect(() => {
    const isNotEntityPath = !isCollectionPath && !isFolderPath
    if (!isNotEntityPath) $ui.routeEntityType.set('')
    if (isCollectionPath) $ui.routeEntityType.set('collection')
    if (isFolderPath) $ui.routeEntityType.set('folder')
  }, [isCollectionPath, isFolderPath])

  React.useEffect(() => {
    if (idParam) $ui.routeEntityId.set(idParam)
    if (!idParam) $ui.routeEntityId.set('')
  }, [idParam])
}
