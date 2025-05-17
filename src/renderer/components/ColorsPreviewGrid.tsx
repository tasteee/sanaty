import { Flex, Text } from '@mantine/core'
import { cssVariablesResolver } from '#/styles/theme/cssVariables'

import {
  zincColors,
  slateColors,
  grayColors,
  neutralColors,
  stoneColors,
  redColors,
  roseColors,
  orangeColors,
  amberColors,
  yellowColors,
  limeColors,
  greenColors,
  emeraldColors,
  tealColors,
  cyanColors,
  skyColors,
  blueColors,
  indigoColors,
  violetColors,
  purpleColors,
  fuchsiaColors,
  pinkColors
} from '#/styles/theme/theme'

const allColors = [
  ...zincColors,
  ...slateColors,
  ...grayColors,
  ...neutralColors,
  ...stoneColors,
  ...redColors,
  ...roseColors,
  ...orangeColors,
  ...amberColors,
  ...yellowColors,
  ...limeColors,
  ...greenColors,
  ...emeraldColors,
  ...tealColors,
  ...cyanColors,
  ...skyColors,
  ...blueColors,
  ...indigoColors,
  ...violetColors,
  ...purpleColors,
  ...fuchsiaColors,
  ...pinkColors
]

const cssVars = cssVariablesResolver()

console.log({ cssVars })
// { dark: { '--mantine-color-foo': 'whatever' }}

const entries = Object.entries(cssVars.dark).sort((a, b) => {
  const keyA = a[0].replace('--mantine-color-', '')
  const keyB = b[0].replace('--mantine-color-', '')
  return keyA.localeCompare(keyB)
})

export const ColorsPreviewGrid = () => {
  return (
    <Flex gap="sm" wrap="wrap" mt="md" flex="1">
      {entries.map(([key, value]) => (
        <div key={key} style={{ width: 150, height: 150, background: value }}>
          <Text>{key}</Text>
        </div>
      ))}
    </Flex>
  )
}
