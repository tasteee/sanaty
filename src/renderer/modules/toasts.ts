import { notifications } from '@mantine/notifications'

export const toasts = {
  collectionCreated() {
    notifications.show({
      title: 'collectionCreated',
      message: 'collectionCreated foo bar baz.'
    })
  },

  collectionDeleted() {
    notifications.show({
      title: 'collectionDeleted',
      message: 'collectionDeleted foo bar baz.'
    })
  },

  collectionUpdated() {
    notifications.show({
      title: 'collectionUpdated',
      message: 'collectionUpdated foo bar baz.'
    })
  },

  sampleAddedToCollection() {
    notifications.show({
      title: 'sampleAddedToCollection',
      message: 'sampleAddedToCollection foo bar baz.'
    })
  },

  folderAdded() {
    notifications.show({
      title: 'folderAdded',
      message: 'folderAdded foo bar baz.'
    })
  },

  folderRefreshed() {
    notifications.show({
      title: 'folderRefreshed',
      message: 'folderRefreshed foo bar baz.'
    })
  },

  folderRemoved() {
    notifications.show({
      title: 'folderRemoved',
      message: 'folderRemoved foo bar baz.'
    })
  }
}
