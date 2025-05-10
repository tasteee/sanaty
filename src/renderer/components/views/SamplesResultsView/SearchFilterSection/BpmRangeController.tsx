import './BpmRangeController.css'
import { Flex, InputGroup, Input } from '#/components'
import React from 'react'
import { $samplesViewStore } from '../samplesView.store'

export const BpmRangeController = () => {
  const minBpmRef = React.useRef(null)
  const maxBpmRef = React.useRef(null)
  const minBpmValue = $samplesViewStore.filters.use((state) => state.bpmMin)
  const maxBpmValue = $samplesViewStore.filters.use((state) => state.bpmMax)

  const onMinBpmBlur = () => {
    $samplesViewStore.setMinBpm(minBpmValue)
  }

  const onMaxBpmBlur = () => {
    $samplesViewStore.setMaxBpm(maxBpmValue)
  }

  const onMinBpmChange = (event) => {
    const numberValue = parseInt(event.target.value)
    const clampedValue = Math.max(numberValue, 0)
    $samplesViewStore.filters.set({ bpmMin: clampedValue })
  }

  const onMaxBpmChange = (event) => {
    const numberValue = parseInt(event.target.value)
    const clampedValue = Math.min(numberValue, 300)
    $samplesViewStore.filters.set({ bpmMax: clampedValue })
  }

  return (
    <Flex gap="2" align="center" className="BpmRangeController" flex="1">
      <InputGroup size="xs" startElement="Min BPM" width="140px" flex="1">
        <Input ref={minBpmRef} size="xs" type="number" value={minBpmValue} onBlur={onMinBpmBlur} onChange={onMinBpmChange} />
      </InputGroup>

      <InputGroup size="xs" startElement="Max BPM" width="140px" flex="1">
        <Input ref={maxBpmRef} size="xs" type="number" value={maxBpmValue} onBlur={onMaxBpmBlur} onChange={onMaxBpmChange} />
      </InputGroup>
    </Flex>
  )
}
