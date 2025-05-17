import './NavBar.css'
import { Center, Stack, Tooltip, UnstyledButton } from '@mantine/core'
import { MantineLogo } from '@mantinex/mantine-logo'
import { CuteIcon } from './ui/CuteIcon'
import { navigateTo } from '#/modules/routing'

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
  return (
    <nav className="NavBar">
      <Center>
        <MantineLogo type="mark" size={30} />
      </Center>

      <div className="NavBarMain">
        <Stack justify="center" gap={0}>
          <NavbarLink label="Folders" path="/folders" iconName="mingcute:folders-line" />
          <NavbarLink label="Samples" path="/samples" iconName="mingcute:music-fill" />
          <NavbarLink label="Collections" path="/collections" iconName="mingcute:playlist-2-fill" />
        </Stack>
      </div>
    </nav>
  )
}
