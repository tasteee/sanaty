import { Select, Portal } from '#/components'

type PropsT = {
  label?: string
  width?: string
  collection: any
  value: string
  onChange: any
  placeholder?: string
}

export const SelectInput = (props: PropsT) => {
  const onChange = (event: any) => {
    const item = props.collection.items.find((item: any) => item.value === event.value[0])
    props.onChange(item, event.value[0])
  }

  return (
    <Select.Root
      size="xs"
      collection={props.collection}
      width={props.width || '120px'}
      value={[props.value]}
      onValueChange={onChange}
    >
      <Select.HiddenSelect />
      {props.label && <Select.Label>{props.label}</Select.Label>}
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder={props.placeholder} />
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
