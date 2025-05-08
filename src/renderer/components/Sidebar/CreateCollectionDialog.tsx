import {
  Button,
  CloseButton,
  Dialog,
  Field,
  Flex,
  HStack,
  Input,
  Portal,
  Text,
  Textarea,
  FileUpload
} from '@chakra-ui/react'
import { Image } from '@chakra-ui/react'
import { HiUpload } from 'react-icons/hi'
import { useState } from 'react'
import { toaster } from '#/components/ui/toaster'
import { $collections } from '#/stores/collections'
import { CuteIcon } from '../ui/CuteIcon'

export const CreateCollectionDialog = (props) => {
  const [name, setName] = useState('')
  const [isOpen, setIsOpen] = useState(true)
  const [description, setDesc] = useState('')
  const [file, setFile] = useState(null)
  const [imageBase64, setImageBase64] = useState('')
  const imageSrc = imageBase64 || 'https://i.imgur.com/Zsft8Uj.png'

  const close = () => {
    setIsOpen(false)
    props.handleClose()
  }

  const handleFileChange = (event) => {
    const files = event.target.files
    if (files && files[0]) {
      const file = files[0]
      const reader = new FileReader()

      reader.onloadend = () => {
        setImageBase64(reader.result)
      }

      reader.readAsDataURL(file)
      setFile(file)
    }
  }

  const handleCreate = async () => {
    const collection = await $collections.createCollection({
      name,
      description,
      artworkPath: imageSrc
    })

    if (collection) {
      toaster.create({
        type: 'success',
        title: 'Collection created',
        duration: 3000,
        isClosable: true
      })
    }

    if (!collection) {
      toaster.create({
        type: 'error',
        title: 'Collection creation failed',
        duration: 3000,
        isClosable: true
      })
    }

    close()
  }

  return (
    <Dialog.Root placement="center" open={isOpen} motionPreset="slide-in-bottom" onOpenChange={(open) => !open && close()}>
      <Portal>
        <Dialog.Backdrop onClick={close} />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Create New Collection</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Flex direction="column" gap="4">
                <Flex gap="3">
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      minWidth: 64,
                      minHeight: 64,
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                      backgroundRepeat: 'no-repeat',
                      background: 'url(' + imageSrc + ')'
                    }}
                  />
                  <Field.Root>
                    <Field.Label>Collection Artwork</Field.Label>
                    <FileUpload.Root>
                      <FileUpload.HiddenInput onChange={handleFileChange} />
                      <FileUpload.Trigger asChild>
                        <Button variant="outline" size="sm" leftIcon={<HiUpload />}>
                          <Text truncate maxW="200px">
                            {file ? file.name : 'Upload Artwork'}
                          </Text>
                          {file && (
                            <CuteIcon
                              name="close"
                              onClick={(event) => {
                                event.stopPropagation()
                                setFile(null)
                                setImageBase64('')
                              }}
                            />
                          )}
                        </Button>
                      </FileUpload.Trigger>
                    </FileUpload.Root>
                  </Field.Root>
                </Flex>
                <Field.Root>
                  <Field.Label>Name</Field.Label>
                  <Input placeholder="Collection name" value={name} onChange={(e) => setName(e.target.value)} />
                </Field.Root>
                <Field.Root>
                  <Field.Label>Description</Field.Label>
                  <Textarea
                    placeholder="Describe your collection"
                    value={description}
                    onChange={(e) => setDesc(e.target.value)}
                  />
                </Field.Root>
              </Flex>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" onClick={close}>
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
              <Button colorScheme="blue" onClick={handleCreate} isDisabled={!name || !file}>
                Create
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" onClick={close} />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
