import { Box, Heading, Spinner, Text } from '#/components'
import { $loaders } from '#/stores/loaders.store'
import { Center } from '@chakra-ui/react'

export const LoadingOverlay = () => {
  const isActive = $loaders.isLoadingView.use()
  if (!isActive) return

  return (
    <Box position="relative" aria-busy="true" userSelect="none" zIndex="999999999" id="LoadingOverlay">
      {/* <Heading>Loading</Heading> */}
      {/* <Text>Gimme a minute. This is free software we're talking about here.</Text> */}
      <Box pos="absolute" inset="0" bg="bg/80">
        <Center h="full">
          <Spinner color="teal.500" />
        </Center>
      </Box>
    </Box>
  )
}
