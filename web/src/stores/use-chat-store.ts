import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type {
  ComposerPayload,
  Conversation,
  ConversationStatus,
  Message,
  MessagePart,
  ModelDefinition,
} from "@/types/chat"

import type { ProviderAdapter } from "@/lib/provider-adapter"

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`
  }

  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}

function now() {
  return new Date().toISOString()
}

function makeConversation(
  model: ModelDefinition,
  handoffFromConversationId?: string
): Conversation {
  const timestamp = now()

  return {
    id: createId("conv"),
    title: "新会话",
    titleMode: "auto",
    modelId: model.id,
    providerId: model.providerId,
    sessionType: model.sessionType,
    status: "idle",
    createdAt: timestamp,
    updatedAt: timestamp,
    handoffFromConversationId,
  }
}

function makeTextPart(text: string): MessagePart | null {
  const normalized = text.trim()

  if (!normalized) {
    return null
  }

  return { type: "text", text: normalized }
}

function makeUserMessage(
  conversationId: string,
  model: ModelDefinition,
  input: ComposerPayload
): Message {
  const parts: MessagePart[] = []
  const textPart = makeTextPart(input.text)

  if (textPart) {
    parts.push(textPart)
  }

  if (input.image) {
    parts.push({ type: "image", image: input.image })
  }

  return {
    id: createId("msg"),
    conversationId,
    role: "user",
    parts,
    state: "complete",
    createdAt: now(),
    meta: {
      modelId: model.id,
      providerId: model.providerId,
      source: "mock",
    },
  }
}

function makeAssistantMessage(
  conversationId: string,
  model: ModelDefinition,
  text: string,
  state: Message["state"] = "complete"
): Message {
  return {
    id: createId("msg"),
    conversationId,
    role: "assistant",
    parts: [{ type: "text", text }],
    state,
    createdAt: now(),
    meta: {
      modelId: model.id,
      providerId: model.providerId,
      source: "mock",
    },
  }
}

function makeConversationTitle(input: ComposerPayload) {
  if (input.text.trim()) {
    return input.text.trim().slice(0, 24)
  }

  if (input.image) {
    return "图片分析"
  }

  return "新会话"
}

function placeConversationFirst(order: string[], conversationId: string) {
  return [conversationId, ...order.filter((id) => id !== conversationId)]
}

function sanitizePersistedMessages(messagesByConversationId: Record<string, Message[]>) {
  return Object.fromEntries(
    Object.entries(messagesByConversationId).map(([conversationId, messages]) => [
      conversationId,
      messages.map((message) => ({
        ...message,
        parts: message.parts.map((part) => {
          if (part.type !== "image") {
            return part
          }

          const needsReset = part.image.previewUrl?.startsWith("blob:")

          return {
            ...part,
            image: {
              ...part.image,
              previewUrl: needsReset ? null : part.image.previewUrl,
              persistenceNote: needsReset
                ? "本地上传图片的预览不会跨刷新持久化，请重新上传原图。"
                : part.image.persistenceNote,
            },
          }
        }),
      })),
    ])
  )
}

interface ChatState {
  conversations: Record<string, Conversation>
  conversationOrder: string[]
  messagesByConversationId: Record<string, Message[]>
  activeConversationId: string | null
  activeRequestConversationId: string | null
  bootstrap: (model: ModelDefinition) => void
  createConversation: (model: ModelDefinition, handoffFromConversationId?: string) => string
  activateConversation: (conversationId: string) => void
  renameConversation: (conversationId: string, nextTitle: string) => void
  deleteConversation: (conversationId: string, fallbackModel: ModelDefinition) => void
  submitWithAdapter: (options: {
    adapter: ProviderAdapter
    conversationId: string
    model: ModelDefinition
    input: ComposerPayload
  }) => Promise<void>
}

function setConversationStatus(
  conversations: Record<string, Conversation>,
  conversationId: string,
  status: ConversationStatus
) {
  const target = conversations[conversationId]

  if (!target) {
    return conversations
  }

  return {
    ...conversations,
    [conversationId]: {
      ...target,
      status,
      updatedAt: now(),
    },
  }
}

const CHAT_STORE_VERSION = 2

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
  conversations: {},
  conversationOrder: [],
  messagesByConversationId: {},
  activeConversationId: null,
  activeRequestConversationId: null,
  bootstrap: (model) => {
    const state = get()

    if (state.activeConversationId && state.conversations[state.activeConversationId]) {
      return
    }

    if (state.conversationOrder.length > 0) {
      const nextConversationId = state.conversationOrder.find((id) => state.conversations[id])

      if (nextConversationId) {
        set({ activeConversationId: nextConversationId })
        return
      }
    }

    const conversationId = get().createConversation(model)
    set({ activeConversationId: conversationId })
  },
  createConversation: (model, handoffFromConversationId) => {
    const conversation = makeConversation(model, handoffFromConversationId)

    set((state) => ({
      conversations: {
        [conversation.id]: conversation,
        ...state.conversations,
      },
      conversationOrder: placeConversationFirst(state.conversationOrder, conversation.id),
      messagesByConversationId: {
        ...state.messagesByConversationId,
        [conversation.id]: [],
      },
      activeConversationId: conversation.id,
    }))

    return conversation.id
  },
  activateConversation: (conversationId) => {
    if (!get().conversations[conversationId]) {
      return
    }

    set({ activeConversationId: conversationId })
  },
  renameConversation: (conversationId, nextTitle) => {
    const trimmedTitle = nextTitle.trim()

    if (!trimmedTitle) {
      return
    }

    set((state) => {
      const conversation = state.conversations[conversationId]

      if (!conversation) {
        return state
      }

      return {
        conversations: {
          ...state.conversations,
          [conversationId]: {
            ...conversation,
            title: trimmedTitle,
            titleMode: "manual",
            updatedAt: now(),
          },
        },
      }
    })
  },
  deleteConversation: (conversationId, fallbackModel) => {
    const state = get()

    if (!state.conversations[conversationId]) {
      return
    }

    const nextOrder = state.conversationOrder.filter((id) => id !== conversationId)
    const nextConversations = { ...state.conversations }
    const nextMessages = { ...state.messagesByConversationId }
    delete nextConversations[conversationId]
    delete nextMessages[conversationId]

    const nextActiveConversationId =
      state.activeConversationId === conversationId ? nextOrder[0] ?? null : state.activeConversationId

    set({
      conversations: nextConversations,
      conversationOrder: nextOrder,
      messagesByConversationId: nextMessages,
      activeConversationId: nextActiveConversationId,
    })

    if (nextOrder.length === 0) {
      const newConversationId = get().createConversation(fallbackModel)
      set({ activeConversationId: newConversationId })
    }
  },
  async submitWithAdapter({ adapter, conversationId, model, input }) {
    const state = get()
    const conversation = state.conversations[conversationId]

    if (!conversation || state.activeRequestConversationId) {
      return
    }

    const userMessage = makeUserMessage(conversationId, model, input)
    const currentMessages = state.messagesByConversationId[conversationId] ?? []
    const nextTitle =
      conversation.titleMode === "auto"
        ? makeConversationTitle(input)
        : conversation.title
    const updatingConversation: Conversation = {
      ...conversation,
      title: nextTitle,
      status: "responding",
      updatedAt: now(),
    }

    set((currentState) => ({
      conversations: {
        ...currentState.conversations,
        [conversationId]: updatingConversation,
      },
      conversationOrder: placeConversationFirst(currentState.conversationOrder, conversationId),
      messagesByConversationId: {
        ...currentState.messagesByConversationId,
        [conversationId]: [...currentMessages, userMessage],
      },
      activeConversationId: conversationId,
      activeRequestConversationId: conversationId,
    }))

    try {
      const result = await adapter.sendMessage({
        conversation: updatingConversation,
        history: [...currentMessages, userMessage],
        model,
        input,
      })

      const assistantMessage = makeAssistantMessage(
        conversationId,
        model,
        result.text
      )

      set((currentState) => ({
        conversations: setConversationStatus(
          currentState.conversations,
          conversationId,
          "idle"
        ),
        messagesByConversationId: {
          ...currentState.messagesByConversationId,
          [conversationId]: [
            ...(currentState.messagesByConversationId[conversationId] ?? []),
            assistantMessage,
          ],
        },
        activeRequestConversationId: null,
      }))
    } catch (error) {
      const fallbackMessage = makeAssistantMessage(
        conversationId,
        model,
        `抱歉，当前 mock 响应失败：${error instanceof Error ? error.message : "未知错误"}`,
        "failed"
      )

      set((currentState) => ({
        conversations: setConversationStatus(
          currentState.conversations,
          conversationId,
          "error"
        ),
        messagesByConversationId: {
          ...currentState.messagesByConversationId,
          [conversationId]: [
            ...(currentState.messagesByConversationId[conversationId] ?? []),
            fallbackMessage,
          ],
        },
        activeRequestConversationId: null,
      }))
    }
  },
}),
    {
      name: "skincareai-chat-store",
      version: CHAT_STORE_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        conversations: Object.fromEntries(
          Object.entries(state.conversations).map(([conversationId, conversation]) => [
            conversationId,
            {
              ...conversation,
              titleMode: conversation.titleMode ?? "auto",
            },
          ])
        ),
        conversationOrder: state.conversationOrder,
        messagesByConversationId: sanitizePersistedMessages(state.messagesByConversationId),
        activeConversationId: state.activeConversationId,
      }),
      migrate: (persistedState) => {
        const typedState = persistedState as Partial<ChatState>

        return {
          ...typedState,
          conversations: Object.fromEntries(
            Object.entries(typedState.conversations ?? {}).map(([conversationId, conversation]) => [
              conversationId,
              {
                ...conversation,
                titleMode: conversation.titleMode ?? "auto",
              },
            ])
          ),
          messagesByConversationId: sanitizePersistedMessages(
            typedState.messagesByConversationId ?? {}
          ),
        }
      },
    }
  )
)
