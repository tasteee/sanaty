import './DurationRangeController.css'
import React from 'react'
import { Flex, InputGroup, Input } from '#/components'
import { $samplesViewStore } from '../samplesView.store'

export const DurationRangeController = () => {
  const minDurationRef = React.useRef(null)
  const maxDurationRef = React.useRef(null)
  const minDurationValue = $samplesViewStore.filters.use((state) => state.durationMin)
  const maxDurationValue = $samplesViewStore.filters.use((state) => state.durationMax)

  const onMinDurationBlur = () => {
    $samplesViewStore.setMinDuration(minDurationValue)
  }

  const onMaxDurationBlur = () => {
    $samplesViewStore.setMaxDuration(maxDurationValue)
  }

  const onMinDurationChange = (event) => {
    const numberValue = parseInt(event.target.value)
    const clampedValue = Math.max(numberValue, 0)
    $samplesViewStore.filters.set({ durationMin: clampedValue })
  }

  const onMaxDurationChange = (event) => {
    const numberValue = parseInt(event.target.value)
    const clampedValue = Math.min(numberValue, 300)
    $samplesViewStore.filters.set({ durationMax: clampedValue })
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
