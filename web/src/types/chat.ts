export type ProviderId = "mock"
export type SessionType = "text" | "vision"
export type ConversationStatus = "idle" | "responding" | "error"

export interface ImageAttachment {
  id: string
  name: string
  mimeType: string
  previewUrl: string | null
  size: number
  persistenceNote?: string
}

export interface ModelDefinition {
  id: string
  providerId: ProviderId
  name: string
  summary: string
  sessionType: SessionType
  supportsImageInput: boolean
  supportsMarkdown: boolean
  status: "available" | "disabled"
  capabilitySummary: string[]
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
  state: "complete" | "failed"
  createdAt: string
  meta: {
    modelId: string
    providerId: ProviderId
    source: "mock"
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
}
