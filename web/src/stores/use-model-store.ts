import { create } from "zustand"

import {
  defaultModelId,
  getModelById as lookupFallbackModel,
  getRecommendedVisionModel as lookupFallbackVisionModel,
  mockModelRegistry,
} from "@/config/mock-model-registry"
import { fetchServerModels } from "@/lib/server-api"
import type { ModelDefinition } from "@/types/chat"

interface ModelState {
  models: ModelDefinition[]
  selectedModelId: string
  modelsLoaded: boolean
  modelsError: string | null
  refreshAt: string | null
  setSelectedModelId: (modelId: string) => void
  setModels: (models: ModelDefinition[], refreshAt?: string | null) => void
  loadModels: (refresh?: boolean) => Promise<void>
  getSelectedModelId: () => string
  getModelById: (modelId: string) => ModelDefinition | undefined
  getRecommendedVisionModelId: () => string
}

function normalizeModels(models: ModelDefinition[]) {
  return models.length > 0 ? models : mockModelRegistry
}

export const useModelStore = create<ModelState>((set, get) => ({
  models: mockModelRegistry,
  selectedModelId: defaultModelId,
  modelsLoaded: false,
  modelsError: null,
  refreshAt: null,
  setSelectedModelId: (modelId) => {
    const model = get().getModelById(modelId)

    if (!model) {
      return
    }

    set({ selectedModelId: modelId })
  },
  setModels: (models, refreshAt = null) => {
    const normalizedModels = normalizeModels(models)
    const currentSelected = get().selectedModelId
    const selectedStillExists = normalizedModels.some((model) => model.id === currentSelected)

    set({
      models: normalizedModels,
      selectedModelId: selectedStillExists ? currentSelected : normalizedModels[0].id,
      refreshAt,
      modelsLoaded: true,
      modelsError: null,
    })
  },
  async loadModels(refresh = false) {
    try {
      const response = await fetchServerModels(refresh)
      get().setModels(response.models, response.refreshedAt)
    } catch (error) {
      set({
        models: mockModelRegistry,
        selectedModelId: get().selectedModelId || defaultModelId,
        modelsLoaded: true,
        modelsError: error instanceof Error ? error.message : "模型加载失败",
      })
    }
  },
  getSelectedModelId: () => get().selectedModelId,
  getModelById: (modelId) =>
    get().models.find((model) => model.id === modelId) ?? lookupFallbackModel(modelId),
  getRecommendedVisionModelId: () => {
    const availableVisionModels = get().models.filter((model) => model.supportsImageInput)

    if (availableVisionModels.length > 0) {
      const onlineVision = availableVisionModels
        .filter((model) => model.status !== "offline")
        .sort((left, right) => (right.recommendedScore || 0) - (left.recommendedScore || 0))

      return (onlineVision[0] || availableVisionModels[0]).id
    }

    return lookupFallbackVisionModel().id
  },
}))
