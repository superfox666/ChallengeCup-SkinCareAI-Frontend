export type ProviderId = string
export type SessionType = "text" | "vision"
export type ConversationStatus = "idle" | "responding" | "error"

export interface ImageAttachment {
  id: string
  name: string
  mimeType: string
  previewUrl: string | null
  size: number
  transportDataUrl?: string | null
  persistenceNote?: string
}

export interface ModelDefinition {
  id: string
  providerId: ProviderId
  apiFormat?: string
  modelId?: string
  name: string
  displayName?: string
  description?: string
  summary: string
  sessionType: SessionType
  supportsImageInput: boolean
  supportsVision?: boolean
  supportsMarkdown: boolean
  supportsStreaming?: boolean
  speedLevel?: string
  priceLevel?: string
  recommendedScore?: number
  capabilities?: string[]
  capabilitySummary: string[]
  status: "available" | "disabled" | "online" | "degraded" | "offline" | "unknown"
  latencyMs?: number | null
  networkHint?: string
  recommendedUseCases?: string[]
  supportedEndpointTypes?: string[]
  available?: boolean
  recommendedForImageHandoff?: boolean
}

export type MessagePart =
  | { type: "text"; text: string }
  | { type: "image"; image: ImageAttachment }

export interface Message {
  id: string
  conversationId: string
  role: "user" | "assistant" | "system"
  parts: MessagePart[]
  state: "complete" | "failed" | "streaming"
  createdAt: string
  meta: {
    modelId: string
    providerId: ProviderId
    source: "mock" | "server"
  }
}

export interface Conversation {
  id: string
  title: string
  titleMode: "auto" | "manual"
  modelId: string
  providerId: ProviderId
  sessionType: SessionType
  status: ConversationStatus
  createdAt: string
  updatedAt: string
  handoffFromConversationId?: string
}

export interface ComposerPayload {
  text: string
  image: ImageAttachment | null
}

export interface ProviderRequest {
  conversation: Conversation
  history: Message[]
  model: ModelDefinition
  input: ComposerPayload
}

export interface AssistantTurnResult {
  text: string
  providerId?: ProviderId
  latencyMs?: number | null
  streamed?: boolean
  meta?: Record<string, unknown>
}
