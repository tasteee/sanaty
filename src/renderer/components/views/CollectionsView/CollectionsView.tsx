import { Card } from '@chakra-ui/react/card'
import { SamplesView } from '../SamplesView/SamplesView'
import { Text } from '@chakra-ui/react/typography'

export const CollectionView = () => {
  return (
    <SamplesView id="CollectionView">
      <CollectionViewHeader />
    </SamplesView>
  )
}

const CollectionViewHeader = () => {
  return (
    <Card.Root>
      <Card.Body>
        <Text>Collection Name</Text>
      </Card.Body>
    </Card.Root>
  )
}
