import './DurationRangeController.css'
import { defineStyle, NumberInput } from '@chakra-ui/react'
import { Flex, InputGroup, Input, Button, Card, Field, Menu, Box, Portal, Text, Em } from '#/components'
import React from 'react'
import { $search } from '#/stores/search.store'
import { _number } from '#/modules/number'

const floatingStyles = defineStyle({
  pos: 'absolute',
  px: '0.5',
  top: '-3',
  bg: 'rgba(17, 17, 17, 0.95)',
  color: 'rgba(255,255,255,0.5)',
  insetStart: '2',
  fontWeight: 'normal',
  pointerEvents: 'none',
  transition: 'position',
  _peerPlaceholderShown: {
    color: 'fg.muted',
    top: '2.5',
    insetStart: '3'
  },
  _peerFocusVisible: {
    color: 'fg',
    top: '-3',
    insetStart: '2'
  }
})

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
    const numberValue = _number(event.value).parseToNumber()
    const clampedValue = Math.max(numberValue, 0)
    $search.filters.set({ durationMin: clampedValue })
  }

  const onMaxDurationChange = (event) => {
    const numberValue = _number(event.value).parseToNumber()
    const clampedValue = Math.min(numberValue, 300)
    $search.filters.set({ durationMax: clampedValue })
  }

  return (
    <Flex gap="4" direction="column" padding="8px 8px 8px 8px" outline="1px solid rgb(39, 39, 42)" mt="2" borderRadius="sm">
      <Text textStyle="sm" fontWeight="semibold" mb="1">
        Length
        <Em ml="2" fontWeight="normal" style={{ color: 'rgba(255,255,255,0.5)' }}>
          (seconds)
        </Em>
      </Text>
      <Field.Root>
        <Box pos="relative" w="full">
          <NumberInput.Root
            size="md"
            value={minDurationValue}
            className="minDurationInput peer"
            placeholder=""
            onBlur={onMinDurationBlur}
            onValueChange={onMinDurationChange}
            min="0"
            max="600"
          >
            <NumberInput.Control />
            <NumberInput.Input />
          </NumberInput.Root>
          <Field.Label css={floatingStyles}>Minimum</Field.Label>
        </Box>
      </Field.Root>

      <Field.Root>
        <Box pos="relative" w="full">
          <NumberInput.Root
            size="md"
            value={maxDurationValue}
            className="maxDurationInput peer"
            placeholder=""
            onBlur={onMaxDurationBlur}
            onValueChange={onMaxDurationChange}
            max="600"
            min="0"
          >
            <NumberInput.Control />
            <NumberInput.Input />
          </NumberInput.Root>
          <Field.Label css={floatingStyles}>Maximum</Field.Label>
        </Box>
      </Field.Root>
    </Flex>
  )

  // return (
  //   <Menu.Root>
  //     <Menu.Trigger asChild>
  //       <Button variant="outline" size="xs">
  //         Length: {minDurationValue}s to {maxDurationValue}s
  //       </Button>
  //     </Menu.Trigger>
  //     <Portal>
  //       <Menu.Positioner>
  //         <Menu.Content className="filterMenuContent">

  //         </Menu.Content>
  //       </Menu.Positioner>
  //     </Portal>
  //   </Menu.Root>
  // )
}
