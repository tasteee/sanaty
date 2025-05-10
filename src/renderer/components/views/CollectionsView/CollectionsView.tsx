import { Card } from '@chakra-ui/react/card'
import { SamplesResultsView } from '../SamplesResultsView/SamplesResultsView'
import { Text } from '@chakra-ui/react/typography'
import { $collections } from '#/stores/collections'
import { Flex } from '@chakra-ui/react/flex'
import { useLocation, useRoute } from 'wouter'
import { Stat } from '@chakra-ui/react'
import React from 'react'
import { useMount, useUnmount } from '@siberiacancode/reactuse'
import { Image } from '@chakra-ui/react/image'
import { Box } from '@chakra-ui/react/box'
import { CuteIcon } from '#/components/ui/CuteIcon'
import { $samplesViewStore } from '../SamplesResultsView/samplesView.store'
import { FocusedViewHeader } from '#/components/FocusedViewHeader'

export const CollectionView = () => {
  const route = useRoute('/collections/collection/:collectionId')
  const params = route[1] as any
  const collection = $collections.useCollection(params.collectionId)
  const sampleCount = collection.sampleIds.length
  const [location, setLocation] = useLocation()

  React.useEffect(() => {
    if (!collection._id) return
    $samplesViewStore.filters.set.reset()
    $samplesViewStore.results.set.reset()
    $samplesViewStore.currentPageResults.set.reset()
    $samplesViewStore.filters.set({ collectionId: collection._id })
    $samplesViewStore.submitSearch()
  }, [location])

  if (!collection.id) setLocation('/')

  return (
    <SamplesResultsView id="CollectionView">
      <FocusedViewHeader
        key={collection._id}
        kind="Collection"
        sampleCount={sampleCount}
        name={collection.name}
        description={collection.description}
        id={collection._id}
      />
    </SamplesResultsView>
  )
}
