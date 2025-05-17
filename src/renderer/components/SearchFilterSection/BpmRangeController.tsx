import { $search } from '#/stores/search.store'
import { toNumber } from '#/modules/number'
import { Fieldset, NumberInput } from '@mantine/core'

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
    <Fieldset legend="BPM" className="BPMRangeController">
      <NumberInput
        label="Minimum"
        placeholder="Minimum"
        hideControls
        value={minBpmValue}
        allowNegative={false}
        min={50}
        max={300}
        onBlur={onMinBpmBlur}
        onChange={onMinBpmChange}
      />
      <NumberInput
        label="Maximum"
        placeholder="Maximum"
        hideControls
        value={maxBpmValue}
        allowNegative={false}
        min={50}
        max={300}
        onBlur={onMaxBpmBlur}
        onChange={onMaxBpmChange}
      />
    </Fieldset>
  )
}
