import { $ui } from '#/stores/ui.store'
import React from 'react'
import { useParams, useRoute, useRouter } from 'wouter'

export function useRoutingSync() {
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
