import './FilterBar.css'
import { Card, Heading, Separator, HStack, Text, Flex, Circle, CuteIcon, ProgressCircle, IconButton } from '#/components'
import { Button, Menu, Portal } from '#/components'
import { BpmRangeController } from './views/SamplesResultsView/SearchFilterSection/BpmRangeController'
import { DurationRangeController } from './views/SamplesResultsView/SearchFilterSection/DurationRangeController'
import { KeySelector } from './views/SamplesResultsView/SearchFilterSection/KeySelector'
import { SampleTypeController } from './views/SamplesResultsView/SearchFilterSection/SampleTypeController'
import { ScaleSelector } from './views/SamplesResultsView/SearchFilterSection/ScaleSelector'
import { SearchInput } from './views/SamplesResultsView/SearchFilterSection/SearchInput'
import { $search } from '#/stores/search.store'
import { Switch } from '@chakra-ui/react'
import React from 'react'
import { $ui } from '#/stores/ui.store'

const SearchButton = () => {
  return (
    <Button colorPalette="pink" size="sm" variant="solid" onClick={$search.searchSamples}>
      Search
    </Button>
  )
}

const ResetButton = () => {
  return (
    <Button colorPalette="gray" size="xs" variant="outline" onClick={$search.resetSearch}>
      Reset Filters
    </Button>
  )
}

export const FilterBar = () => {
  return (
    <Card.Root maxW="sm" height="98%" overflow="hidden" className="FilterBar">
      <Card.Body className="FilterBarBody" padding="4">
        <Flex direction="column" height="100%" justify="space-between">
          <Flex direction="column" gap="2" height="100%" justify="space-between">
            <Flex direction="column" gap="2">
              <Heading mb="2">Search & Filter</Heading>
              <SearchInput />
              <SampleTypeController />
              <KeySelector />
              <ScaleSelector />
              <BpmRangeController />
              <DurationRangeController />
            </Flex>
            <Flex direction="column" gap="4">
              <LikedSwitch />
              <Flex direction="column" gap="2">
                <SearchButton />
                <ResetButton />
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Card.Body>
    </Card.Root>
  )
}

const LikedSwitch = () => {
  const isActive = $search.useIsLikedFilterActive()

  const handleClick = (event) => {
    $search.filters.set({ isLiked: event.checked })
  }

  return (
    <Flex mt="2" mb="2" justify="center">
      <Switch.Root checked={isActive} variant="solid" colorPalette={isActive ? 'pink' : 'gray'} onCheckedChange={handleClick}>
        <Switch.HiddenInput />
        <Switch.Label>Only Show Liked</Switch.Label>
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
      </Switch.Root>
    </Flex>
  )
}
