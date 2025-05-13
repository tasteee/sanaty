import { SamplesResultsView } from '../SamplesResultsView/SamplesResultsView'
import { $collections } from '#/stores/collections.store'
import { FocusedViewHeader } from '#/components/FocusedViewHeader'
import { $search } from '#/stores/search.store'
import React from 'react'
import { useParams, useRoute, useLocation } from 'wouter'

export const InnerCollectionView = (props) => {
  const collection = $collections.useCollection(props.collectionId)
  if (!collection) return <p>4040404</p>

  console.log('CollectionView', { collection })

  return (
    <SamplesResultsView id="CollectionView">
      <FocusedViewHeader
        id={collection._id}
        kind="Collection"
        name={collection.name}
        description={collection.description}
        sampleCount={collection.sampleCount}
      />
    </SamplesResultsView>
  )
}

export const CollectionView = () => {
  const params = useParams()
  const [isCollectionPath] = useRoute('/collections/*?')
  const [isFolderPath] = useRoute('/folders/*?')
  const idParam = params.id
  const [location] = useLocation()

  React.useEffect(() => {
    console.log('Router', { params, location, idParam, isCollectionPath, isFolderPath })
    if (!idParam) return
    if (!isCollectionPath && !isFolderPath) return
    console.log('using the effect...', { idParam, isCollectionPath, isFolderPath, idParam })
    const key = isCollectionPath ? 'collectionId' : 'folderId'
    $search.filters.set.reset()
    $search.results.set.reset()
    $search.pagination.set.reset()
    $search.filters.set({ [key]: idParam })
    $search.searchSamples()
  }, [idParam, isCollectionPath, isFolderPath, location])

  return <InnerCollectionView collectionId={idParam} />
}
