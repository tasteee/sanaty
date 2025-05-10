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
import { HiUpload } from 'react-icons/hi'
import { useState, useEffect } from 'react'
import { toaster } from '#/components/ui/toaster'
import { CuteIcon } from '../ui/CuteIcon'
import { $collections } from '#/stores/collections'

export const EditCollectionDialog = ({ id, handleClose }) => {
  const collection = $collections.useCollection(id)
  const [isOpen, setIsOpen] = useState(true)
  const [name, setName] = useState(collection?.name || '')
  const [description, setDesc] = useState(collection?.description || '')
  const [file, setFile] = useState(null)
  const [imageBase64, setImageBase64] = useState('')
  const imageSrc = imageBase64 || collection?.artworkPath || 'https://placehold.co/400'

  const close = () => {
    setIsOpen(false)
    handleClose?.()
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

  const handleSave = async () => {
    const { result, error } = await $collections.updateCollection(id, {
      name,
      description,
      artworkPath: imageSrc
    })

    if (error) {
      toaster.create({
        type: 'error',
        title: 'Failed to update collection',
        duration: 3000,
        isClosable: true
      })

      debugger
      return
    }

    console.log('edit collection result: ', result)

    toaster.create({
      type: 'success',
      title: 'Collection updated',
      duration: 3000,
      isClosable: true
    })

    handleClose?.()
  }

  return (
    <Dialog.Root placement="center" open={isOpen} motionPreset="slide-in-bottom" onOpenChange={(open) => !open && close()}>
      <Portal>
        <Dialog.Backdrop onClick={close} />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Edit Collection</Dialog.Title>
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
                            {file ? file.name : 'Change Artwork'}
                          </Text>
                          {(file || imageBase64) && (
                            <CuteIcon
                              name="close"
                              onClick={(e) => {
                                e.stopPropagation()
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
              <Button colorScheme="blue" onClick={handleSave} isDisabled={!name}>
                Save
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
