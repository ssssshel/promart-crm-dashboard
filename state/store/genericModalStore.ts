import { create } from "zustand";

interface GenericModalActions {
  openDialog: () => void;
  closeDialog: () => void;
  setDialogContent: (dialogContent: GenericModalState['dialogContent']) => void
  // setTitle: (title: ConfirmationDialogState['dialogContent']) => void;
}

export interface GenericModalState extends GenericModalActions {
  isDialogOpen: boolean;
  dialogContent: {
    title: string;
    description: string;
    buttons:
    | Array<{
      name: string;
      action?: () => void;
    }>
  }
}
export const useGenericModalStore = create<GenericModalState>((set) => ({
  isDialogOpen: false,
  dialogContent: {
    title: '',
    description: '',
    buttons: []
  },

  openDialog: () => {
    set((state) => ({ ...state, isDialogOpen: true }))
  },
  closeDialog: () => {
    set((state) => ({ ...state, isDialogOpen: false }))
  },

  setDialogContent: (dialogContent) => {
    set((state) => ({
      dialogContent: {
        ...state.dialogContent,
        ...dialogContent
      }
    }))
  }
}))