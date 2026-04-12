import type { AssistantTurnResult, ProviderRequest } from "@/types/chat"

import { fetchServerModels, postChatMessage, postVisionMessage } from "@/lib/server-api"
import type { ProviderAdapter } from "@/lib/provider-adapter"

function mapHistory(history: ProviderRequest["history"]) {
  return history.map((message) => ({
    role: message.role,
    parts: message.parts
      .filter((part) => part.type === "text")
      .map((part) => ({ type: part.type, text: part.text })),
  }))
}

export const serverAdapter: ProviderAdapter = {
  id: "server",
  async getModels() {
    const response = await fetchServerModels(false)
    return response.models
  },
  async sendMessage(input: ProviderRequest): Promise<AssistantTurnResult> {
    if (input.input.image && input.model.supportsImageInput) {
      const response = await postVisionMessage({
        modelId: input.model.modelId || input.model.id,
        input: input.input,
      })

      return {
        text: response.message,
        providerId: response.providerId,
        latencyMs: response.latencyMs,
        meta: response.meta,
      }
    }

    const response = await postChatMessage({
      modelId: input.model.modelId || input.model.id,
      history: mapHistory(input.history),
      input: input.input,
    })

    return {
      text: response.message,
      providerId: response.providerId,
      latencyMs: response.latencyMs,
      meta: response.meta,
    }
  },
}
