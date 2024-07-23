import { create } from "zustand";

interface LoadingScreenActions {
  openLoadingScreen: () => void
  closeLoadingScreen: () => void
}

export interface LoadingScreenState extends LoadingScreenActions {
  isLoadingScreenOpen: boolean
}

export const useLoadingScreenStore = create<LoadingScreenState>((set) => ({
  isLoadingScreenOpen: true,

  openLoadingScreen: () => {
    set((state) => ({ isLoadingScreenOpen: true }))
  },
  closeLoadingScreen: () => {
    set((state) => ({ isLoadingScreenOpen: false }))
  }
}))