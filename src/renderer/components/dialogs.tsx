import { createCollectionDialog } from './Sidebar/CreateCollectionDialog'
import { editCollectionDialog } from './Sidebar/EditCollectionDialog'

export const dialogs = {
  editCollection: {
    open: (collectionId) => {
      const id = crypto.randomUUID()
      const handleClose = () => dialogs.editCollection.close(id)
      editCollectionDialog.open(id, { collectionId, handleClose })
    },

    close: (id) => {
      editCollectionDialog.close(id)
    }
  },

  createCollection: {
    open: () => {
      const id = crypto.randomUUID()
      const handleClose = () => createCollectionDialog.close(id)
      createCollectionDialog.open(id, { handleClose })
    },

    close: (id) => createCollectionDialog.close(id)
  }
}

globalThis.dialogs = dialogs
