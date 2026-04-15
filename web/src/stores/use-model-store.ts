import { create } from "zustand"

import {
  defaultModelId,
  getModelById as lookupFallbackModel,
  getRecommendedVisionModel as lookupFallbackVisionModel,
  mockModelRegistry,
} from "@/config/mock-model-registry"
import { getDefaultVisionModel } from "@/lib/model-config"
import { getDefaultGeneralModel } from "@/lib/model-config"
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
    const defaultGeneralModel = getDefaultGeneralModel(normalizedModels)

    set({
      models: normalizedModels,
      selectedModelId:
        selectedStillExists ? currentSelected : defaultGeneralModel?.id ?? normalizedModels[0].id,
      refreshAt,
      modelsLoaded: true,
      modelsError: null,
    })
  },
  async loadModels(refresh = false) {
    const previousModels = get().models
    const previousSelectedModelId = get().selectedModelId

    try {
      const response = await fetchServerModels(refresh)
      get().setModels(response.models, response.refreshedAt)
    } catch (error) {
      const shouldKeepPreviousModels =
        previousModels.length > 0 &&
        previousModels.some((model) => model.providerId !== "mock")

      set({
        models: shouldKeepPreviousModels ? previousModels : mockModelRegistry,
        selectedModelId: shouldKeepPreviousModels ? previousSelectedModelId : defaultModelId,
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
      const preferredVision = getDefaultVisionModel(availableVisionModels)

      if (preferredVision) {
        return preferredVision.id
      }

      return availableVisionModels[0].id
    }

    return lookupFallbackVisionModel().id
  },
}))
