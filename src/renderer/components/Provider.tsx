import '@mantine/core/styles.css'
import '#/styles/theme/theme.css'
import { MantineProvider } from '@mantine/core'
import { cssVariablesResolver } from '#/styles/theme/cssVariables'
import { theme } from '#/styles/theme/theme'

import { Provider as _Provider } from '#/components'
import { AudioPlayerProvider } from 'react-use-audio-player'

export const Provider = (props) => {
  return (
    <_Provider>
      <MantineProvider cssVariablesResolver={cssVariablesResolver} theme={theme} defaultColorScheme="dark">
        <AudioPlayerProvider>{props.children}</AudioPlayerProvider>
      </MantineProvider>
    </_Provider>
  )
}
