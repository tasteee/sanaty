import { CuteIcon } from './CuteIcon'
import Color from 'color'
import './CaretIcon.css'

const white75 = Color('#ffffff').alpha(0.75).hexa()

type CaretIconPropsT = {
  isOpen: boolean
  onClick: any
  size?: number
}

export const CaretIcon = (props: CaretIconPropsT) => {
  const caretRotation = props.isOpen ? 135 : 90

  return (
    <CuteIcon
      name="left"
      kind="fill"
      size={props.size || 18}
      rotate={caretRotation}
      color={white75}
      onClick={props.onClick}
      className="CaretIcon"
    />
  )
}
