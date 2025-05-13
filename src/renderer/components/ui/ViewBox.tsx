import { Flex } from '#/components'
import { motion } from 'framer-motion'

export const ViewBox = (props) => {
  return (
    <motion.div
      className="ViewBoxMotionDiv"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, delay: 0.5 }}
      style={{ width: '100%', height: '100%' }}
    >
      <Flex direction="column" gap="2" flex="1" overflow="hidden" {...props} className={`${props.className || ''} ViewBoxFlex`} />
    </motion.div>
  )
}
