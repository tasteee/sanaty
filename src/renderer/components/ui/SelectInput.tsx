import { Select, Portal } from '#/components'

type PropsT = {
  label?: string
  width?: string
  collection: any
  value: string
  onChange: any
  placeholder?: string
  masker?: any
  className?: string
  flex?: string
  size?: string
}

const DEFAULT_MASKER = (item: any) => {
  return item.label
}

export const SelectInput = (props: PropsT) => {
  const masker = props.masker || DEFAULT_MASKER
  const selectedItem = props.collection.items.find((item: any) => item.value === props.value)
  const maskedValueText = selectedItem ? masker(selectedItem) : props.placeholder

  const onChange = (event: any) => {
    const value = event.value[0]
    const item = props.collection.items.find((item: any) => item.value === value)
    props.onChange(item, value)
  }

  return (
    <Select.Root
      size={props.size || 'sm'}
      className={props.className}
      collection={props.collection}
      width={props.width || '120px'}
      value={[props.value]}
      flex={props.flex || '0'}
      onValueChange={onChange}
    >
      <Select.HiddenSelect />
      {props.label && <Select.Label>{props.label}</Select.Label>}
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder={props.placeholder}>{maskedValueText}</Select.ValueText>
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            {props.collection.items.map((item: any) => (
              <Select.Item item={item} key={item.value}>
                {item.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  )
}
