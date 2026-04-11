import type { AssistantTurnResult, ModelDefinition, ProviderId, ProviderRequest } from "@/types/chat"

export interface ProviderAdapter {
  id: ProviderId
  getModels(): Promise<ModelDefinition[]>
  sendMessage(input: ProviderRequest): Promise<AssistantTurnResult>
}
