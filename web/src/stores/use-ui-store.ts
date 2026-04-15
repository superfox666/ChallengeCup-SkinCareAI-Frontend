import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type { ComposerPayload } from "@/types/chat"

interface UiState {
  composerNotice: string | null
  theme: "dark" | "light" | "soft"
  sidebarCollapsed: boolean
  modelWorkspaceExpanded: boolean
  draftTransfer:
    | {
        conversationId: string
        payload: ComposerPayload
      }
    | null
  setComposerNotice: (notice: string | null) => void
  setDraftTransfer: (draftTransfer: UiState["draftTransfer"]) => void
  setTheme: (theme: UiState["theme"]) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setModelWorkspaceExpanded: (expanded: boolean) => void
  toggleSidebarCollapsed: () => void
  toggleModelWorkspaceExpanded: () => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      composerNotice: null,
      theme: "dark",
      sidebarCollapsed: false,
      modelWorkspaceExpanded: false,
      draftTransfer: null,
      setComposerNotice: (composerNotice) => set({ composerNotice }),
      setDraftTransfer: (draftTransfer) => set({ draftTransfer }),
      setTheme: (theme) => set({ theme }),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      setModelWorkspaceExpanded: (modelWorkspaceExpanded) => set({ modelWorkspaceExpanded }),
      toggleSidebarCollapsed: () =>
        set((state) => ({
          sidebarCollapsed: !state.sidebarCollapsed,
        })),
      toggleModelWorkspaceExpanded: () =>
        set((state) => ({
          modelWorkspaceExpanded: !state.modelWorkspaceExpanded,
        })),
    }),
    {
      name: "skincareai-ui-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        modelWorkspaceExpanded: state.modelWorkspaceExpanded,
      }),
    }
  )
)
