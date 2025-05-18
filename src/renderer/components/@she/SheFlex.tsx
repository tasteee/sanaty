import { Flex } from '@mantine/core'
import clsx from 'clsx'

const SheFlex = (props) => {
  const className = clsx('SheFlex', props.className)
  const otherProps = { ...props }
  return <Flex {...otherProps} className={className} />
}

SheFlex.Row = (props) => {
  const className = clsx('SheFlexRow', props.className)
  return <SheFlex {...props} className={className} direction="row" />
}

SheFlex.Column = (props) => {
  const className = clsx('SheFlexColumn', props.className)
  return <SheFlex {...props} className={className} direction="column" />
}
