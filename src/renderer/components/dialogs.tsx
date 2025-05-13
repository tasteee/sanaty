import { createCollectionDialog } from './Sidebar/CreateCollectionDialog'
import { editCollectionDialog } from './Sidebar/EditCollectionDialog'

const createDialog = (target) => {
  let uuid = crypto.randomUUID()

  function close() {
    target.close(uuid)
  }

  function open(props = {} as any) {
    const handleClose = () => {
      props.onClose?.()
      close()
    }

    target.open(uuid, { ...props, handleClose })
    return handleClose
  }

  return {
    open,
    close
  }
}

export const dialogs = {
  editCollection: createDialog(editCollectionDialog),
  createCollection: createDialog(createCollectionDialog)
}

globalThis.dialogs = dialogs
