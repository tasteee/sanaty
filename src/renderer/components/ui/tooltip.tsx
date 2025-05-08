import { Tooltip as ChakraTooltip, Portal } from '#/components'
import * as React from 'react'

export type TooltipProps = ChakraTooltip.RootProps & {
  showArrow?: boolean
  portalled?: boolean
  portalRef?: React.RefObject<HTMLElement>
  content: React.ReactNode
  contentProps?: ChakraTooltip.ContentProps
  disabled?: boolean
  children: any
  openDelay: number
  positioning: any
  isOpen?: boolean
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(props, ref) {
  const { showArrow, children, disabled, portalled = true, content, contentProps, portalRef, isOpen, ...rest } = props
  if (disabled) return children

  return (
    <ChakraTooltip.Root {...rest} open={isOpen}>
      <ChakraTooltip.Trigger asChild>{children}</ChakraTooltip.Trigger>
      <Portal disabled={!portalled} container={portalRef}>
        <ChakraTooltip.Positioner>
          <ChakraTooltip.Content ref={ref} {...contentProps}>
            {showArrow && (
              <ChakraTooltip.Arrow>
                <ChakraTooltip.ArrowTip />
              </ChakraTooltip.Arrow>
            )}
            {content}
          </ChakraTooltip.Content>
        </ChakraTooltip.Positioner>
      </Portal>
    </ChakraTooltip.Root>
  )
})
