import { useToggle } from '@mantine/hooks'

export const useModalState = () => {
  const [isOpen, toggleIsOpen] = useToggle()
  const toggleOpen = () => toggleIsOpen()
  const setIsOpen = (value) => toggleIsOpen(value)
  return { isOpen, toggleOpen, setIsOpen }
}
