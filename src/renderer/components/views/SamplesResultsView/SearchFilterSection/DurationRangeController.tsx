import { $search } from '#/stores/search.store'
import { _number, toNumber } from '#/modules/number'
import { Fieldset, NumberInput } from '@mantine/core'

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
    <Fieldset legend="Length" className="DurationRangeController">
      <NumberInput
        label="Minimum"
        placeholder="Minimum"
        hideControls
        value={minDurationValue}
        allowNegative={false}
        min={0}
        max={300}
        onBlur={onMinDurationBlur}
        onChange={onMinDurationChange}
      />
      <NumberInput
        label="Maximum"
        placeholder="Maximum"
        hideControls
        value={maxDurationValue}
        allowNegative={false}
        min={1}
        max={300}
        onBlur={onMaxDurationBlur}
        onChange={onMaxDurationChange}
      />
    </Fieldset>
  )
}
