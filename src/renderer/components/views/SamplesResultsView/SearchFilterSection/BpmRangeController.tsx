import './BpmRangeController.css'
import { Flex, InputGroup, Input } from '#/components'
import React from 'react'
import { $search } from '#/stores/search.store'

export const BpmRangeController = () => {
  const minBpmRef = React.useRef(null)
  const maxBpmRef = React.useRef(null)
  const minBpmValue = $search.filters.use((state) => state.bpmMin)
  const maxBpmValue = $search.filters.use((state) => state.bpmMax)

  const onMinBpmBlur = () => {
    $search.setMinBpm(minBpmValue)
  }

  const onMaxBpmBlur = () => {
    $search.setMaxBpm(maxBpmValue)
  }

  const onMinBpmChange = (event) => {
    const numberValue = parseInt(event.target.value)
    const clampedValue = Math.max(numberValue, 0)
    $search.filters.set({ bpmMin: clampedValue })
  }

  const onMaxBpmChange = (event) => {
    const numberValue = parseInt(event.target.value)
    const clampedValue = Math.min(numberValue, 300)
    $search.filters.set({ bpmMax: clampedValue })
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
