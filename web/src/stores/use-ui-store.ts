import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type { TonePreset } from "@/lib/tone-preset"
import type { ComposerPayload } from "@/types/chat"

interface UiState {
  composerNotice: string | null
  theme: "dark" | "light" | "soft"
  tonePreset: TonePreset
  showAdvancedComposerTools: boolean
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
  setTonePreset: (tonePreset: TonePreset) => void
  setShowAdvancedComposerTools: (showAdvancedComposerTools: boolean) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setModelWorkspaceExpanded: (expanded: boolean) => void
  toggleAdvancedComposerTools: () => void
  toggleSidebarCollapsed: () => void
  toggleModelWorkspaceExpanded: () => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      composerNotice: null,
      theme: "dark",
      tonePreset: "professional",
      showAdvancedComposerTools: false,
      sidebarCollapsed: false,
      modelWorkspaceExpanded: false,
      draftTransfer: null,
      setComposerNotice: (composerNotice) => set({ composerNotice }),
      setDraftTransfer: (draftTransfer) => set({ draftTransfer }),
      setTheme: (theme) => set({ theme }),
      setTonePreset: (tonePreset) => set({ tonePreset }),
      setShowAdvancedComposerTools: (showAdvancedComposerTools) =>
        set({ showAdvancedComposerTools }),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      setModelWorkspaceExpanded: (modelWorkspaceExpanded) => set({ modelWorkspaceExpanded }),
      toggleAdvancedComposerTools: () =>
        set((state) => ({
          showAdvancedComposerTools: !state.showAdvancedComposerTools,
        })),
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
      version: 3,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState) => {
        const state = persistedState as Partial<UiState> | undefined

        return {
          composerNotice: null,
          theme: state?.theme ?? "dark",
          tonePreset: state?.tonePreset ?? "professional",
          showAdvancedComposerTools: false,
          sidebarCollapsed: false,
          modelWorkspaceExpanded: false,
          draftTransfer: null,
        }
      },
      partialize: (state) => ({
        theme: state.theme,
        tonePreset: state.tonePreset,
      }),
    }
  )
)
