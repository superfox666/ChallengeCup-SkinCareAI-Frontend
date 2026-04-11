import { create } from "zustand"

import {
  defaultModelId,
  getModelById as lookupModel,
  getRecommendedVisionModel as lookupRecommendedVisionModel,
  mockModelRegistry,
} from "@/config/mock-model-registry"

interface ModelState {
  models: typeof mockModelRegistry
  selectedModelId: string
  setSelectedModelId: (modelId: string) => void
  getSelectedModelId: () => string
  getModelById: (modelId: string) => (typeof mockModelRegistry)[number] | undefined
  getRecommendedVisionModelId: () => string
}

export const useModelStore = create<ModelState>((set, get) => ({
  models: mockModelRegistry,
  selectedModelId: defaultModelId,
  setSelectedModelId: (modelId) => {
    if (!lookupModel(modelId)) {
      return
    }

    set({ selectedModelId: modelId })
  },
  getSelectedModelId: () => get().selectedModelId,
  getModelById: (modelId) => lookupModel(modelId),
  getRecommendedVisionModelId: () => lookupRecommendedVisionModel().id,
}))
