import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type { ComposerPayload } from "@/types/chat"

interface UiState {
  composerNotice: string | null
  theme: "dark" | "light" | "soft"
  draftTransfer:
    | {
        conversationId: string
        payload: ComposerPayload
      }
    | null
  setComposerNotice: (notice: string | null) => void
  setDraftTransfer: (draftTransfer: UiState["draftTransfer"]) => void
  setTheme: (theme: UiState["theme"]) => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
  composerNotice: null,
  theme: "dark",
  draftTransfer: null,
  setComposerNotice: (composerNotice) => set({ composerNotice }),
  setDraftTransfer: (draftTransfer) => set({ draftTransfer }),
  setTheme: (theme) => set({ theme }),
}),
    {
      name: "skincareai-ui-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
      }),
    }
  )
)
