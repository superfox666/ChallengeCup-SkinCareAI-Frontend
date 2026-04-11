import { create } from "zustand"

interface UiState {
  composerNotice: string | null
  setComposerNotice: (notice: string | null) => void
}

export const useUiStore = create<UiState>((set) => ({
  composerNotice: null,
  setComposerNotice: (composerNotice) => set({ composerNotice }),
}))
