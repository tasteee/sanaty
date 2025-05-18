import { useState } from 'react'
import { $collections } from '#/stores/collections.store'
import { Flex, Text, Button, FileButton, Modal, TextInput } from '@mantine/core'
import { useArtworkHandler } from '#/modules/useArtworkHandler'

type CreateCollectionDialogPropsT = {
  onClose: () => void
}

export const CreateCollectionDialog = (props: CreateCollectionDialogPropsT) => {
  const onSubmit = async (data) => {
    const response = await $collections.create(data)
    response.didPass && props.onClose()
  }

  return <CollectionDialog title="Create a collection" onSubmit={onSubmit} onClose={props.onClose} />
}

type EditCollectionDialogPropsT = {
  id: string
  name: string
  description: string
  artwork: string
  onClose: () => void
}

export const EditCollectionDialog = (props: EditCollectionDialogPropsT) => {
  const onSubmit = async (data) => {
    const finalData = { id: props.id, ...data }
    const response = await $collections.edit(finalData)
    response.didPass && props.onClose()
  }

  return (
    <CollectionDialog
      title="Edit collection"
      onSubmit={onSubmit}
      name={props.name}
      description={props.description}
      artwork={props.artwork}
      onClose={props.onClose}
    />
  )
}

export const CollectionDialog = (props) => {
  const [isOpen, setIsOpen] = useState(true)

  const [name, setName] = useState(props.name || '')
  const [description, setDescription] = useState(props.description || '')
  const artwork = useArtworkHandler(props.artwork || '')

  const onClose = () => {
    setIsOpen(false)
    props.onClose?.()
  }

  const onSubmitClick = async () => {
    props.onSubmit({
      name,
      description,
      artwork: artwork.imageSrc
    })
  }

  return (
    <Modal opened={isOpen} onClose={onClose} title={props.title}>
      <Flex direction="column" gap="md">
        <Flex gap="sm">
          <div
            style={{
              width: 64,
              height: 64,
              minWidth: 64,
              minHeight: 64,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              background: 'url(' + artwork.imageSrc + ')'
            }}
          />

          <Flex gap="sm" direction="column">
            <FileButton onChange={artwork.onFileChange} accept="image/png,image/jpeg">
              {(props) => <Button {...props}>Upload Artwork</Button>}
            </FileButton>

            {artwork.file && (
              <Text size="sm" ta="center" mt="sm">
                {artwork.file.name}
              </Text>
            )}
          </Flex>
        </Flex>

        <Flex direction="column" gap="md">
          <TextInput
            label="Name"
            placeholder="name your collection..."
            value={name}
            onChange={(event) => setName(event.currentTarget.value)}
          />

          <TextInput
            label="Description"
            placeholder="describe your collection..."
            value={description}
            onChange={(event) => setDescription(event.currentTarget.value)}
          />
        </Flex>

        <Flex gap="md" justify="end">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="light" onClick={onSubmitClick}>
            Submit
          </Button>
        </Flex>
      </Flex>
    </Modal>
  )
}
