import './DurationRangeController.css'
import React from 'react'
import { Flex, InputGroup, Input } from '#/components'
import { $search } from '#/stores/search.store'

export const DurationRangeController = () => {
  const minDurationRef = React.useRef(null)
  const maxDurationRef = React.useRef(null)
  const minDurationValue = $search.filters.use((state) => state.durationMin)
  const maxDurationValue = $search.filters.use((state) => state.durationMax)

  const onMinDurationBlur = () => {
    $search.setMinDuration(minDurationValue)
  }

  const onMaxDurationBlur = () => {
    $search.setMaxDuration(maxDurationValue)
  }

  const onMinDurationChange = (event) => {
    const numberValue = parseInt(event.target.value)
    const clampedValue = Math.max(numberValue, 0)
    $search.filters.set({ durationMin: clampedValue })
  }

  const onMaxDurationChange = (event) => {
    const numberValue = parseInt(event.target.value)
    const clampedValue = Math.min(numberValue, 300)
    $search.filters.set({ durationMax: clampedValue })
  }

  return (
    <Flex gap="2" align="center" className="DurationRangeController" flex="1">
      <InputGroup size="xs" startElement="Min Duration" width="140px" flex="1">
        <Input
          ref={minDurationRef}
          size="xs"
          type="number"
          value={minDurationValue}
          onBlur={onMinDurationBlur}
          onChange={onMinDurationChange}
        />
      </InputGroup>

      <InputGroup size="xs" startElement="Max Duration" width="140px" flex="1">
        <Input
          ref={maxDurationRef}
          size="xs"
          type="number"
          value={maxDurationValue}
          onBlur={onMaxDurationBlur}
          onChange={onMaxDurationChange}
        />
      </InputGroup>
    </Flex>
  )
}
