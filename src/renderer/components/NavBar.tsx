import './NavBar.css'
import { Center, Flex, Popover, Slider, Stack, Tooltip, UnstyledButton } from '@mantine/core'
import { CuteIcon } from './CuteIcon'
import { navigateTo } from '#/modules/routing'
import { $playback } from '#/stores/playback.store'
import { Icon } from '@iconify/react'

type NavbarLinkPropsT = {
  iconName: string
  label: string
  path: string
  isActive?: boolean
}

const NavbarLink = (props: NavbarLinkPropsT) => {
  const onClick = () => navigateTo(props.path)

  return (
    <Tooltip label={props.label} position="right" transitionProps={{ duration: 0 }} offset={5}>
      <UnstyledButton onClick={onClick} className="NavBarLink" data-active={props.isActive || undefined}>
        <CuteIcon customIcon={props.iconName} size="lg" />
      </UnstyledButton>
    </Tooltip>
  )
}

export const NavBar = () => {
  const volume = $playback.volume.use()

  return (
    <nav className="NavBar">
      <Center>
        <img src="https://i.imgur.com/fc3lTS2.png" style={{ width: 30, height: 30 }} />
      </Center>

      <div className="NavBarMain">
        <Stack justify="center" gap={0}>
          <NavbarLink label="Samples" path="/samples" iconName="mingcute:music-fill" />
          <NavbarLink label="Collections" path="/collections" iconName="mingcute:playlist-2-fill" />
          <NavbarLink label="Folders" path="/folders" iconName="mingcute:folders-line" />
        </Stack>
      </div>

      <Flex className="VolumeController" mb="md" justify="center">
        <Popover width={240} withArrow shadow="md" position="right">
          <Popover.Target>
            <Icon icon="mingcute:volume-line" width={24} height={24} />
          </Popover.Target>
          <Popover.Dropdown style={{ background: 'var(--mantine-color-dark-8)', paddingTop: 12 }}>
            <Slider className="VolumeSlider" min={0} max={100} value={volume} onChange={$playback.volume.set} />
          </Popover.Dropdown>
        </Popover>
      </Flex>
    </nav>
  )
}
