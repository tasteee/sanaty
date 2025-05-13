import './BpmRangeController.css'
import { defineStyle, NumberInput } from '@chakra-ui/react'
import { Flex, InputGroup, Input, Text, Button, Card, Field, Menu, Box, Portal, Em } from '#/components'
import React from 'react'
import { $search } from '#/stores/search.store'
import { _number } from '#/modules/number'

const floatingStyles = defineStyle({
  pos: 'absolute',
  bg: 'rgba(17, 17, 17, 0.75)',
  px: '0.5',
  top: '-3',
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
    const numberValue = _number(event.value).parseToNumber()
    const clampedValue = Math.max(numberValue, 0)
    $search.filters.set({ bpmMin: clampedValue })
  }

  const onMaxBpmChange = (event) => {
    const numberValue = _number(event.value).parseToNumber()
    const clampedValue = Math.min(numberValue, 300)
    $search.filters.set({ bpmMax: clampedValue })
  }

  return (
    <Flex gap="4" direction="column" padding="8px 8px 8px 8px" outline="1px solid rgb(39, 39, 42)" mt="2" borderRadius="sm">
      <Text textStyle="sm" fontWeight="semibold" mb="1">
        BPM
      </Text>{' '}
      <Field.Root>
        <Box pos="relative" w="full">
          <NumberInput.Root
            size="md"
            value={minBpmValue}
            className="minBpmInput peer"
            placeholder=""
            onBlur={onMinBpmBlur}
            onValueChange={onMinBpmChange}
            min="50"
            max="300"
          >
            <NumberInput.Control />
            <NumberInput.Input />
          </NumberInput.Root>
          <Field.Label css={floatingStyles}>Minimum BPM</Field.Label>
        </Box>
      </Field.Root>
      <Field.Root>
        <Box pos="relative" w="full">
          <NumberInput.Root
            size="md"
            value={maxBpmValue}
            className="maxBpmInput peer"
            placeholder=""
            onBlur={onMaxBpmBlur}
            onValueChange={onMaxBpmChange}
            max="300"
            min="50"
          >
            <NumberInput.Control />
            <NumberInput.Input />
          </NumberInput.Root>
          <Field.Label css={floatingStyles}>Maximum BPM</Field.Label>
        </Box>
      </Field.Root>
    </Flex>
  )

  // return (
  //   <Menu.Root className="BpmRangeController" variant="subtle">
  //     <Menu.Trigger asChild>
  //       <Button variant="outline" size="xs">
  //         BPM: {minBpmValue} to {maxBpmValue}
  //       </Button>
  //     </Menu.Trigger>
  //     <Portal>
  //       <Menu.Positioner>
  //         <Menu.Content className="filterMenuContent">
  //           <Flex gap="2">
  //             <Field.Root>
  //               <Box pos="relative" w="full">
  //                 <NumberInput.Root
  //                   value={minBpmValue}
  //                   className="minBpmInput peer"
  //                   placeholder=""
  //                   onBlur={onMinBpmBlur}
  //                   onValueChange={onMinBpmChange}
  //                   min="50"
  //                   max="300"
  //                 >
  //                   <NumberInput.Control />
  //                   <NumberInput.Input />
  //                 </NumberInput.Root>
  //                 <Field.Label css={floatingStyles}>Minimum BPM</Field.Label>
  //               </Box>
  //             </Field.Root>

  //             <Field.Root>
  //               <Box pos="relative" w="full">
  //                 <NumberInput.Root
  //                   value={maxBpmValue}
  //                   className="maxBpmInput peer"
  //                   placeholder=""
  //                   onBlur={onMaxBpmBlur}
  //                   onValueChange={onMaxBpmChange}
  //                   max="300"
  //                   min="50"
  //                 >
  //                   <NumberInput.Control />
  //                   <NumberInput.Input />
  //                 </NumberInput.Root>
  //                 <Field.Label css={floatingStyles}>Maximum BPM</Field.Label>
  //               </Box>
  //             </Field.Root>
  //           </Flex>
  //         </Menu.Content>
  //       </Menu.Positioner>
  //     </Portal>
  //   </Menu.Root>
  // )

  // return (
  //   <Flex gap="2" align="center" className="BpmRangeController" flex="1">
  //     <InputGroup size="xs" startElement="Min BPM" width="140px" flex="1">
  //       <Input ref={minBpmRef} size="xs" type="number" value={minBpmValue} onBlur={onMinBpmBlur} onChange={onMinBpmChange} />
  //     </InputGroup>

  //     <InputGroup size="xs" startElement="Max BPM" width="140px" flex="1">
  //       <Input ref={maxBpmRef} size="xs" type="number" value={maxBpmValue} onBlur={onMaxBpmBlur} onChange={onMaxBpmChange} />
  //     </InputGroup>
  //   </Flex>
  // )
}

// import { useToggle } from '@siberiacancode/reactuse'
// import './AssetResultsList.css'
// import { Box, Flex, Portal, IconButton, Text, Tag, Menu, CuteIcon, Popover } from '#/components'
// import { HoverCard } from '#/components'
// import { PLACEMENTS } from '#/constants'

// export const AssetRowOptionsMenu = (props) => {
//   const [isOpen, toggleOpen] = useToggle()
//   const handleOpenChange = (event) => toggleOpen(event.open)

//   const handleSettingsClick = (event) => {
//     event.stopPropagation()
//     toggleOpen(false)
//   }

//   return (
//     <HoverCard.Root positioning={PLACEMENTS.BOTTOM_END} onOpenChange={handleOpenChange} openDelay={150}>
//       <HoverCard.Trigger asChild>
//         <IconButton variant="plain" colorPalette={{ base: 'gray', _hover: 'purple' }}>
//           <CuteIcon name="more-3" />
//         </IconButton>
//       </HoverCard.Trigger>
//       <Portal>
//         <HoverCard.Positioner>
//           <HoverCard.Content className="hoverCardContent" as={Flex}>
//             <Menu.Root open={isOpen} maxW>
//               <Menu.Content style={{ zIndex: 99999 }}>
//                 <Menu.Item className="hoverCardMenuItem" value="dislike" onClick={handleSettingsClick}>
//                   Dislike
//                 </Menu.Item>
//                 <Menu.Item className="hoverCardMenuItem" value="support">
//                   Support
//                 </Menu.Item>
//                 <Menu.Item className="hoverCardMenuItem" value="addFolder">
//                   Add Folder
//                 </Menu.Item>
//               </Menu.Content>
//             </Menu.Root>
//           </HoverCard.Content>
//         </HoverCard.Positioner>
//       </Portal>
//     </HoverCard.Root>
//   )
// }
