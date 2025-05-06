import './BpmRangeController.css'
import { $filters } from '#/stores/search.store'
import { Flex, InputGroup, Input } from '#/components'
import React from 'react'

export const BpmRangeController = () => {
  const minBpmRef = React.useRef(null)
  const maxBpmRef = React.useRef(null)
  const bpmRange = $filters.bpmRange.use()
  const minBpmValue = bpmRange[0]
  const maxBpmValue = bpmRange[1]

  const onMinBpmBlur = () => {
    $filters.setMinBpm(minBpmValue)
  }

  const onMaxBpmBlur = () => {
    $filters.setMaxBpm(maxBpmValue)
  }

  const onMinBpmChange = (event) => {
    const numberValue = parseInt(event.target.value)
    const clampedValue = Math.max(numberValue, 0)
    $filters.bpmRange.set([clampedValue, maxBpmValue])
  }

  const onMaxBpmChange = (event) => {
    const numberValue = parseInt(event.target.value)
    const clampedValue = Math.min(numberValue, 300)
    $filters.bpmRange.set([minBpmValue, clampedValue])
  }

  return (
    <Flex gap="2" align="center" className="BpmRangeController">
      <InputGroup size="xs" startElement="Min BPM" width="140px">
        <Input ref={minBpmRef} size="xs" type="number" value={minBpmValue} onBlur={onMinBpmBlur} onChange={onMinBpmChange} />
      </InputGroup>

      <InputGroup size="xs" startElement="Max BPM" width="140px">
        <Input ref={maxBpmRef} size="xs" type="number" value={maxBpmValue} onBlur={onMaxBpmBlur} onChange={onMaxBpmChange} />
      </InputGroup>
    </Flex>
  )
}
