import { CuteIcon } from './CuteIcon'
import { Flex, Title } from '@mantine/core'
import { motion } from 'framer-motion'
import clsx from 'clsx'

const ViewMotionDivStyle = { width: '100%', height: '100%' }
const ViewMotionDivTransition = { duration: 1.5, delay: 0.5 }
const ViewMotionDivInitial = { opacity: 0 }
const ViewMotionDivAnimate = { opacity: 1 }

export const View = (props) => {
  const innerClassName = clsx('View', props.className)

  return (
    <motion.div
      className="ViewMotionDiv"
      initial={ViewMotionDivInitial}
      animate={ViewMotionDivAnimate}
      transition={ViewMotionDivTransition}
      style={ViewMotionDivStyle}
    >
      <Flex direction="column" gap="sm" pt="xs" pl="sm" pr="sm" flex="1" overflow="hidden" {...props} className={innerClassName} />
    </motion.div>
  )
}

View.Heading = (props) => {
  return (
    <Flex gap="xs" mt="md" align="center" className="ViewHeading" justify="space-between">
      <Flex gap="xs" align="center" className="ViewHeadingMain">
        {props.iconName && <CuteIcon customIcon={props.iconName} size="2xl" />}
        <Title order={2} lh="80%">
          {props.title}
        </Title>
      </Flex>
      {props.children}
    </Flex>
  )
}
