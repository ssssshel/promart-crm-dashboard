import { useGenericModalStore } from "../state/store/genericModalStore"

const GenericModalComponent = () => {
  const [isDialogOpen, dialogContent, openDialog, closeDialog, setDialogContent] = useGenericModalStore(state => [
    state.isDialogOpen,
    state.dialogContent,
    state.openDialog,
    state.closeDialog,
    state.setDialogContent
  ])

  const handleCloseDialog = () => {
    setDialogContent({
      buttons: [],
      title: "",
      description: ""
    })
    closeDialog()
    window.location.reload()
  }

  return (
    <div
      id="modal"
      className={`${isDialogOpen ? 'fixed' : 'hidden'
        } top-0 left-0 z-50 flex items-center justify-center w-screen h-screen bg-slate-600/50 backdrop-blur-sm`}
    >
      <div className="flex flex-col items-center justify-center gap-6 p-6 rounded-lg w-full max-w-md bg-white text-gray-800 shadow-lg">
        <p className="text-2xl font-semibold">{dialogContent.title}</p>
        <p className="text-gray-600">{dialogContent.description}</p>
        <div className="flex gap-4">
          {dialogContent.buttons.length > 0 ? (
            dialogContent.buttons.map(({ name, action }) => (
              <button
                key={name}
                className="px-4 py-2 border border-gray-300 rounded-md bg-indigo-600 text-white font-medium hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50"
                onClick={!action ? handleCloseDialog : action}
              >
                {name}
              </button>
            ))
          ) : (
            <button
              className="px-4 py-2 border border-gray-300 rounded-md bg-indigo-600 text-white font-medium hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50"
              onClick={handleCloseDialog}
            >
              Cerrar
            </button>
          )}
        </div>
      </div>
    </div>

  )
}

export default GenericModalComponent