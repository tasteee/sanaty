import { $search } from '#/stores/search.store'
import { ActionIcon, Button, Checkbox, Flex, Group, Input, Space, Stack, Text, useMatches } from '@mantine/core'
import { Select } from '@mantine/core'
import { CuteIcon } from './ui/CuteIcon'
import { toNumber } from '#/modules/number'
import { NumberInput } from '@mantine/core'
import { SCALE_LABELS } from '#/constants/scales'
import { TONIC_LABELS } from '#/constants/keys'
import { Popover } from '@mantine/core'
import { useDebouncedCallback } from '@mantine/hooks'

export const SearchControls = () => {
  const pt = useMatches({
    base: 'sm',
    sm: 'sm',
    lg: 'sm'
  })

  const width = useMatches({
    base: '100%',
    sm: '100%',
    lg: '100%'
  })

  return (
    <Flex gap="xs" pt={pt} style={{ width, maxWidth: 980 }}>
      <SearchInput />
      <LikedFilterSwitch />
      <TonicSelect />
      <ScaleSelect />
      <SampleTypeSelect />
      <BPMMenuButton />
      <LengthMenuButton />
    </Flex>
  )
}

const searchIcon = <CuteIcon name="search-2" size="sm" color="#71717a" />

export const SearchInput = () => {
  const value = $search.filters.use((state) => state.searchValue)

  const handleSearch = useDebouncedCallback(() => {
    $search.softSearchSamples()
  }, 1000)

  const clearValue = () => {
    $search.filters.set({ searchValue: '' })
    handleSearch()
  }

  const onChange = (event: any) => {
    $search.filters.set({ searchValue: event.target.value })
    handleSearch()
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
      style={{ width: '100%' }}
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
      data={['Any Type', 'Shots', 'Loops']}
      style={{ width: 120, minWidth: 120 }}
    />
  )
}

export const ScaleSelect = () => {
  const scale = $search.filters.use((state) => state.scale)
  const setScale = (value) => $search.filters.set({ scale: value })
  return (
    <Select data={SCALE_LABELS} size="xs" placeholder="Scale" value={scale} onChange={setScale} style={{ width: 120, minWidth: 120 }} />
  )
}

export const TonicSelect = () => {
  const tonic = $search.filters.use((state) => state.tonic)
  const setTonic = (value) => $search.filters.set({ tonic: value })

  return (
    <Select
      size="xs"
      className="TonicSelect"
      placeholder="Tonic"
      value={tonic}
      onChange={setTonic}
      data={TONIC_LABELS}
      style={{ width: 120, minWidth: 120 }}
    />
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

  return (
    <Group gap="xs" grow align="center">
      <NumberInput
        size="xs"
        label="Min BPM"
        placeholder="Min BPM"
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
        label="Max BPM"
        placeholder="Max BPM"
        hideControls
        value={maxBpmValue}
        allowNegative={false}
        min={50}
        max={300}
        onBlur={onMaxBpmBlur}
        onChange={onMaxBpmChange}
      />
    </Group>
  )
}

const BPMMenuButton = () => {
  const minBpmValue = $search.filters.use((state) => state.bpmMin)
  const maxBpmValue = $search.filters.use((state) => state.bpmMax)
  return (
    <Popover width={240} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Button variant="default" size="xs" color="gray" radius="xs" style={{ width: 120, minWidth: 120 }}>
          BPM {minBpmValue}-{maxBpmValue}
        </Button>
      </Popover.Target>
      <Popover.Dropdown style={{ background: 'var(--mantine-color-dark-8)', paddingTop: 8 }}>
        <BpmRangeController />
      </Popover.Dropdown>
    </Popover>
  )
}

const LengthMenuButton = () => {
  const minDurationValue = $search.filters.use((state) => state.durationMin)
  const maxDurationValue = $search.filters.use((state) => state.durationMax)

  return (
    <Popover width={240} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Button variant="default" size="xs" color="gray" radius="xs" style={{ width: 120, minWidth: 120 }}>
          Length {minDurationValue}-{maxDurationValue}
        </Button>
      </Popover.Target>
      <Popover.Dropdown style={{ background: 'var(--mantine-color-dark-8)', paddingTop: 8 }}>
        <DurationRangeController />
      </Popover.Dropdown>
    </Popover>
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

  return (
    <Group gap="xs" grow align="center">
      <NumberInput
        label="Min Length"
        placeholder="Min Length"
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
        label="Max Length"
        placeholder="Max Length"
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
  )
}

export const LikedFilterSwitch = () => {
  const isActive = $search.filters.use((state) => state.isLiked)
  const variant = isActive ? 'filled' : 'default'
  const iconName = isActive ? 'bxs:heart' : 'bx:heart'
  const iconColor = isActive ? '#ec4899' : '#71717a'
  const color = isActive ? 'pink' : 'gray'
  const scale = isActive ? 1.25 : 1.1
  const style = { scale }

  const handleClick = (event) => {
    event.stopPropagation()
    $search.filters.set({ isLiked: !$search.filters.state.isLiked })
    handleSearch()
  }

  const handleSearch = useDebouncedCallback(() => {
    $search.softSearchSamples()
  }, 500)

  return (
    <ActionIcon size="md" variant={variant} color={color} aria-label="liked" onClick={handleClick}>
      <CuteIcon customIcon={iconName} color={iconColor} style={style} />
    </ActionIcon>
  )
}

const BottomButtons = () => {
  return (
    <Flex direction="row" gap="sm">
      <Button size="xs" variant="filled">
        Search
      </Button>
    </Flex>
  )
}
