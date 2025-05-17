import { $search } from '#/stores/search.store'
import { Button, Checkbox, Flex, Group, Input, Space, Stack, Text } from '@mantine/core'
import { Select } from '@mantine/core'
import { CuteIcon } from './ui/CuteIcon'
import { toNumber } from '#/modules/number'
import { Fieldset, NumberInput } from '@mantine/core'

export const SearchBar = () => {
  return (
    <Stack gap="md" className="SearchBar" justify="space-between" style={{ minWidth: 240, width: 240 }}>
      <Flex gap="md" direction="column">
        <SearchInput />
        <SampleTypeSelect />
        {/* <TonicSelect /> */}
        {/* <ScaleSelect /> */}
        <ModeController />
        <DurationRangeController />
        <BpmRangeController />
      </Flex>
      <Flex gap="md" direction="column">
        <LikedFilterSwitch />
        <BottomButtons />
      </Flex>
    </Stack>
  )
}

const searchIcon = <CuteIcon name="search-2" size="sm" color="#71717a" />

export const SearchInput = () => {
  const value = $search.filters.use((state) => state.searchValue)

  const clearValue = () => {
    $search.filters.set({ searchValue: '' })
  }

  const onChange = (event: any) => {
    $search.filters.set({ searchValue: event.target.value })
  }

  const getRightSection = () => {
    if (value) return <Input.ClearButton onClick={clearValue} />
    return null
  }

  return (
    <Input
      value={value}
      placeholder="Search"
      onChange={onChange}
      leftSection={searchIcon}
      rightSection={getRightSection()}
      rightSectionPointerEvents="auto"
      size="xs"
    />
  )
}

export const SampleTypeSelect = () => {
  const sampleType = $search.filters.use((state) => state.sampleType)
  const setSampleType = (value) => $search.filters.set({ sampleType: value })

  return (
    <Select
      size="xs"
      // label="Type"
      placeholder="Type"
      value={sampleType}
      onChange={setSampleType}
      width="100%"
      data={['Any Type', 'Shots', 'Loops']}
    />
  )
}

import { SCALE_LABELS } from '#/constants/scales'

export const ScaleSelect = () => {
  const scale = $search.filters.use((state) => state.scale)
  const setScale = (value) => $search.filters.set({ scale: value })
  return <Select data={SCALE_LABELS} size="xs" placeholder="Scale" value={scale} onChange={setScale} />
}

import { TONIC_LABELS } from '#/constants/keys'

export const TonicSelect = () => {
  const tonic = $search.filters.use((state) => state.tonic)
  const setTonic = (value) => $search.filters.set({ tonic: value })

  return <Select size="xs" className="TonicSelect" placeholder="Tonic" value={tonic} onChange={setTonic} data={TONIC_LABELS} />
}

export const ModeController = () => {
  return (
    // <Fieldset legend="Mode" p="xs">
    <Flex gap="xs" align="center">
      <TonicSelect />
      <ScaleSelect />
    </Flex>
    // </Fieldset>
  )
}

export const BpmRangeController = () => {
  const minBpmValue = $search.filters.use((state) => state.bpmMin)
  const maxBpmValue = $search.filters.use((state) => state.bpmMax)

  const onMinBpmBlur = () => {
    $search.setMinBpm(minBpmValue)
  }

  const onMaxBpmBlur = () => {
    $search.setMaxBpm(maxBpmValue)
  }

  const onMinBpmChange = (value) => {
    const numberValue = toNumber(value)
    const clampedValue = Math.max(numberValue, 0)
    $search.filters.set({ bpmMin: clampedValue })
  }

  const onMaxBpmChange = (value) => {
    const numberValue = toNumber(value)
    const clampedValue = Math.min(numberValue, 300)
    $search.filters.set({ bpmMax: clampedValue })
  }

  const legend = (
    <Flex gap="xs">
      Tempo
      <span style={{ color: 'gray' }}>(BPM)</span>
    </Flex>
  )

  return (
    <Fieldset legend={legend} p="xs">
      <Group gap="xs" grow align="center">
        <NumberInput
          size="xs"
          label="Min"
          placeholder="Min"
          hideControls
          value={minBpmValue}
          allowNegative={false}
          min={50}
          max={300}
          onBlur={onMinBpmBlur}
          onChange={onMinBpmChange}
        />

        <NumberInput
          size="xs"
          label="Max"
          placeholder="Max"
          hideControls
          value={maxBpmValue}
          allowNegative={false}
          min={50}
          max={300}
          onBlur={onMaxBpmBlur}
          onChange={onMaxBpmChange}
        />
      </Group>
    </Fieldset>
  )
}

export const DurationRangeController = () => {
  const minDurationValue = $search.filters.use((state) => state.durationMin)
  const maxDurationValue = $search.filters.use((state) => state.durationMax)

  const onMinDurationBlur = () => {
    $search.setMinDuration(minDurationValue)
  }

  const onMaxDurationBlur = () => {
    $search.setMaxDuration(maxDurationValue)
  }

  const onMinDurationChange = (value) => {
    const numberValue = toNumber(value)
    const clampedValue = Math.max(numberValue, 0)
    $search.filters.set({ durationMin: clampedValue })
  }

  const onMaxDurationChange = (value) => {
    const numberValue = toNumber(value)
    const clampedValue = Math.min(numberValue, 300)
    $search.filters.set({ durationMax: clampedValue })
  }

  const legend = (
    <Flex gap="xs">
      Duration
      <span style={{ color: 'gray' }}>(seconds)</span>
    </Flex>
  )

  return (
    <Fieldset legend={legend} p="xs">
      <Group gap="xs" grow align="center">
        <NumberInput
          label="Min"
          placeholder="Min"
          hideControls
          value={minDurationValue}
          allowNegative={false}
          size="xs"
          min={0}
          max={300}
          onBlur={onMinDurationBlur}
          onChange={onMinDurationChange}
        />
        <NumberInput
          label="Max"
          placeholder="Max"
          hideControls
          value={maxDurationValue}
          allowNegative={false}
          size="xs"
          min={1}
          max={300}
          onBlur={onMaxDurationBlur}
          onChange={onMaxDurationChange}
        />
      </Group>
    </Fieldset>
  )
}

const LikedFilterSwitch = () => {
  const isActive = $search.useIsLikedFilterActive()

  const handleClick = (event) => {
    $search.filters.set({ isLiked: event.currentTarget.checked })
  }

  return <Checkbox checked={isActive} onChange={handleClick} label="Only Show Liked" />
}

const BottomButtons = () => {
  return (
    <Flex direction="column" gap="sm">
      <Button size="xs" variant="light">
        Search
      </Button>
      <Button size="xs" variant="subtle">
        Reset
      </Button>
    </Flex>
  )
}
