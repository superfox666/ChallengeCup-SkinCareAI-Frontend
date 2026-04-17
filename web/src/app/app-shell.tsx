import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { useLocation } from "react-router-dom"
import { Maximize2Icon, Minimize2Icon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DevRuntimeBadge } from "@/components/dev-runtime-badge"
import { InfoHint } from "@/components/ui/info-hint"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { knowledgeEntries } from "@/content/knowledge"
import { Composer } from "@/features/chat/composer"
import { MessageList } from "@/features/chat/message-list"
import { ExpertConsultPanel } from "@/features/consult/expert-consult-panel"
import { DisclaimerCard } from "@/features/context-rail/disclaimer-card"
import { ModelCapabilityCard } from "@/features/context-rail/model-capability-card"
import { ChatWorkspaceDeck, type ChatWorkspaceTabId } from "@/features/layout/chat-workspace-deck"
import { KnowledgePage } from "@/features/knowledge/knowledge-page"
import { BrandBlock } from "@/features/sidebar/brand-block"
import { ConversationList } from "@/features/sidebar/conversation-list"
import { NewConversationButton } from "@/features/sidebar/new-conversation-button"
import { TopBar } from "@/features/topbar/top-bar"
import { ModelSelector } from "@/features/topbar/model-selector"
import { ModelStatusBadge } from "@/features/topbar/model-ui"
import { buildClinicalConsultPrompt } from "@/lib/clinical-consult-prompt"
import { mockAdapter } from "@/lib/mock-adapter"
import { type ProviderAdapter } from "@/lib/provider-adapter"
import { publishRuntimeSnapshot } from "@/lib/runtime-instance"
import {
  buildAssistantTurnMarkdown,
  buildConversationMarkdown,
  buildConversationPlainText,
  copyTextToClipboard,
  downloadTextFile,
  getAssistantTurnExportFilename,
  getConversationExportFilename,
} from "@/lib/share-utils"
import { streamChatMessage } from "@/lib/server-api"
import { serverAdapter } from "@/lib/server-adapter"
import { getDefaultGeneralModel, getModelDisplayName, getModelPrimaryHint, getModelRoleLabel } from "@/lib/model-config"
import { useChatStore } from "@/stores/use-chat-store"
import { useModelStore } from "@/stores/use-model-store"
import { useUiStore } from "@/stores/use-ui-store"
import type { ComposerPayload, Message, ModelDefinition } from "@/types/chat"

const starterPromptFallback = "最近脸上反复长痘，日常护理应该怎么调整？"
const drawerHelpDetail = [
  "1. 聊天标签页保留消息区、输入区、上传与发送入口。",
  "2. 模型标签页用于切换分类和模型，长说明放在问号提示里。",
  "3. 会话树、使用帮助、免责声明和产品介绍统一收进左上角抽屉。",
  "4. 如果某个区域内容较多，请直接在区域内部滚动，而不是整页下滑找内容。",
].join("\n")
const drawerDisclaimerDetail = [
  "1. 当前版本以演示交互闭环为主，不替代真实临床诊断。",
  "2. 仅供皮肤健康咨询与科普参考，不替代面诊、检查和处方。",
  "3. 如持续恶化、渗液、感染或明显疼痛，请及时线下就医。",
  "4. 如果遇到空白回答、乱码或网络波动，请优先重试一次，必要时切换模型继续。",
].join("\n")
const drawerIntroDetail = [
  "1. SkinCareAI 以聊天区作为主入口，模型工作台和知识页作为辅助工作区。",
  "2. 切换模型会自动新建会话，避免不同模型混用上下文。",
  "3. 非视觉模型收到图片时会 handoff 到视觉模型新会话。",
  "4. 整体结构遵循“高频主区常显，低频说明抽屉化”的布局原则。",
].join("\n")

function buildModelMap(models: ModelDefinition[]) {
  return Object.fromEntries(models.map((model) => [model.id, model]))
}

function mapHistoryForServer(history: Parameters<ProviderAdapter["sendMessage"]>[0]["history"]) {
  return history.map((message) => ({
    role: message.role,
    parts: message.parts
      .filter((part) => part.type === "text")
      .map((part) => ({ type: part.type, text: part.text })),
  }))
}

function summarizeNotice(notice: string | null, maxLength = 48) {
  if (!notice) {
    return null
  }

  const normalized = notice.replace(/\s+/g, " ").trim()

  if (normalized.length <= maxLength) {
    return normalized
  }

  return `${normalized.slice(0, maxLength)}…`
}

function hasDraftPayload(payload?: ComposerPayload | null) {
  return Boolean(payload?.text.trim() || payload?.image)
}

function formatRefreshTime(refreshAt: string | null) {
  if (!refreshAt) {
    return null
  }

  const parsed = new Date(refreshAt)

  if (Number.isNaN(parsed.getTime())) {
    return null
  }

  return parsed.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

export function AppShell() {
  const location = useLocation()
  const isKnowledgeRoute = location.pathname === "/knowledge"
  const [isConsultOpen, setIsConsultOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isChatFullscreen, setIsChatFullscreen] = useState(false)
  const [isModelFullscreen, setIsModelFullscreen] = useState(false)

  const models = useModelStore((state) => state.models)
  const selectedModelId = useModelStore((state) => state.selectedModelId)
  const setSelectedModelId = useModelStore((state) => state.setSelectedModelId)
  const modelsError = useModelStore((state) => state.modelsError)
  const refreshAt = useModelStore((state) => state.refreshAt)
  const loadModels = useModelStore((state) => state.loadModels)
  const getRecommendedVisionModelId = useModelStore((state) => state.getRecommendedVisionModelId)

  const conversationOrder = useChatStore((state) => state.conversationOrder)
  const conversations = useChatStore((state) => state.conversations)
  const messagesByConversationId = useChatStore((state) => state.messagesByConversationId)
  const activeConversationId = useChatStore((state) => state.activeConversationId)
  const activeRequestConversationId = useChatStore((state) => state.activeRequestConversationId)
  const bootstrap = useChatStore((state) => state.bootstrap)
  const createConversation = useChatStore((state) => state.createConversation)
  const activateConversation = useChatStore((state) => state.activateConversation)
  const renameConversation = useChatStore((state) => state.renameConversation)
  const updateConversationTags = useChatStore((state) => state.updateConversationTags)
  const archiveConversation = useChatStore((state) => state.archiveConversation)
  const restoreConversation = useChatStore((state) => state.restoreConversation)
  const deleteConversation = useChatStore((state) => state.deleteConversation)
  const submitWithAdapter = useChatStore((state) => state.submitWithAdapter)
  const upsertAssistantStream = useChatStore((state) => state.upsertAssistantStream)

  const composerNotice = useUiStore((state) => state.composerNotice)
  const draftTransfer = useUiStore((state) => state.draftTransfer)
  const theme = useUiStore((state) => state.theme)
  const tonePreset = useUiStore((state) => state.tonePreset)
  const setComposerNotice = useUiStore((state) => state.setComposerNotice)
  const setDraftTransfer = useUiStore((state) => state.setDraftTransfer)
  const setTheme = useUiStore((state) => state.setTheme)
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<ChatWorkspaceTabId>("chat")
  const [composerDrafts, setComposerDrafts] = useState<Record<string, ComposerPayload>>({})
  const [isRefreshingModels, setIsRefreshingModels] = useState(false)
  const modelRefreshLockRef = useRef(false)

  const modelsById = useMemo(() => buildModelMap(models), [models])
  const orderedConversations = useMemo(
    () => conversationOrder.map((id) => conversations[id]).filter(Boolean),
    [conversationOrder, conversations]
  )
  const messagesCountById = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(messagesByConversationId).map(([conversationId, messages]) => [
          conversationId,
          messages.length,
        ])
      ),
    [messagesByConversationId]
  )

  const currentConversation = activeConversationId ? conversations[activeConversationId] : null
  const currentModel =
    (currentConversation && modelsById[currentConversation.modelId]) ??
    modelsById[selectedModelId] ??
    models[0]
  const defaultGeneralModel = useMemo(
    () => getDefaultGeneralModel(models) ?? currentModel,
    [currentModel, models]
  )
  const activeMessages = useMemo(
    () => (activeConversationId ? messagesByConversationId[activeConversationId] ?? [] : []),
    [activeConversationId, messagesByConversationId]
  )
  const shareableMessages = useMemo(
    () => activeMessages.filter((message) => message.role !== "system"),
    [activeMessages]
  )
  const isBusy = activeRequestConversationId !== null
  const suggestedVisionModel = modelsById[getRecommendedVisionModelId()] ?? null
  const supportsNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function"
  const initialDraft =
    (activeConversationId ? composerDrafts[activeConversationId] : null) ??
    (draftTransfer && draftTransfer.conversationId === activeConversationId
      ? draftTransfer.payload
      : null)
  const shortComposerNotice = useMemo(
    () => summarizeNotice(composerNotice),
    [composerNotice]
  )
  const lastRefreshTimeLabel = useMemo(() => formatRefreshTime(refreshAt), [refreshAt])

  const refreshModels = useCallback(async () => {
    if (modelRefreshLockRef.current) {
      return
    }

    modelRefreshLockRef.current = true
    setIsRefreshingModels(true)

    try {
      await loadModels(true)
    } finally {
      modelRefreshLockRef.current = false
      setIsRefreshingModels(false)
    }
  }, [loadModels])

  const streamingServerAdapter = useMemo<ProviderAdapter>(
    () => ({
      id: "server",
      getModels: serverAdapter.getModels,
      async sendMessage(input) {
        if (input.input.image && input.model.supportsImageInput) {
          return serverAdapter.sendMessage(input)
        }

        const messageId = `stream-${crypto.randomUUID()}`
        let finalText = ""

        try {
          await streamChatMessage(
            {
              modelId: input.model.modelId || input.model.id,
              history: mapHistoryForServer(input.history),
              input: input.input,
            },
            {
              onDelta(delta) {
                finalText += delta
                upsertAssistantStream({
                  conversationId: input.conversation.id,
                  model: input.model,
                  messageId,
                  text: finalText,
                  state: "streaming",
                })
              },
              onDone(text) {
                finalText = text || finalText
                upsertAssistantStream({
                  conversationId: input.conversation.id,
                  model: input.model,
                  messageId,
                  text: finalText,
                  state: "complete",
                })
              },
            }
          )

          return {
            text: finalText,
            streamed: true,
          }
        } catch (error) {
          if (finalText) {
            upsertAssistantStream({
              conversationId: input.conversation.id,
              model: input.model,
              messageId,
              text: finalText,
              state: "failed",
            })
          }

          throw error
        }
      },
    }),
    [upsertAssistantStream]
  )

  useEffect(() => {
    void loadModels(false)
  }, [loadModels])

  useEffect(() => {
    if (isKnowledgeRoute) {
      return
    }

    void refreshModels()
    const timer = window.setInterval(() => {
      void refreshModels()
    }, 5000)
    return () => window.clearInterval(timer)
  }, [isKnowledgeRoute, refreshModels])

  useEffect(() => {
    if (isKnowledgeRoute) {
      setIsChatFullscreen(false)
      setIsModelFullscreen(false)
    }
  }, [isKnowledgeRoute])

  useEffect(() => {
    if (!isChatFullscreen) {
      return
    }

    setActiveWorkspaceTab("chat")
    setIsDrawerOpen(false)
    setIsConsultOpen(false)

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsChatFullscreen(false)
      }
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [isChatFullscreen])

  useEffect(() => {
    if (!isModelFullscreen) {
      return
    }

    setActiveWorkspaceTab("models")
    setIsDrawerOpen(false)
    setIsConsultOpen(false)

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsModelFullscreen(false)
      }
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [isModelFullscreen])

  useEffect(() => {
    if (currentModel) {
      bootstrap(currentModel)
    }
  }, [bootstrap, currentModel])

  useEffect(() => {
    if (draftTransfer && draftTransfer.conversationId === activeConversationId) {
      setDraftTransfer(null)
    }
  }, [activeConversationId, draftTransfer, setDraftTransfer])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    document.documentElement.setAttribute("data-theme", theme)
  }, [theme])

  useEffect(() => {
    publishRuntimeSnapshot({
      route: location.pathname,
      currentView: isKnowledgeRoute ? "knowledge" : "chat",
      routeMarker: isKnowledgeRoute
        ? `knowledge-all-${knowledgeEntries.length}`
        : `chat-models-${models.length}`,
      modelCount: models.length,
      knowledgeCount: knowledgeEntries.length,
      currentModelId: currentModel?.id ?? null,
      activeWorkspaceTab,
    })
  }, [
    activeWorkspaceTab,
    currentModel?.id,
    isKnowledgeRoute,
    location.pathname,
    models.length,
  ])

  const handleDraftChange = useCallback(
    (payload: ComposerPayload) => {
      if (!activeConversationId) {
        return
      }

      setComposerDrafts((current) => {
        if (!hasDraftPayload(payload)) {
          if (!(activeConversationId in current)) {
            return current
          }

          const nextDrafts = { ...current }
          delete nextDrafts[activeConversationId]
          return nextDrafts
        }

        return {
          ...current,
          [activeConversationId]: payload,
        }
      })
    },
    [activeConversationId]
  )

  const createFreshConversation = (
    modelId: string,
    notice: string | null,
    draftPayload?: ComposerPayload | null
  ) => {
    const model = modelsById[modelId]
    if (!model) return

    startTransition(() => {
      const conversationId = createConversation(model)
      if (hasDraftPayload(draftPayload)) {
        setDraftTransfer({
          conversationId,
          payload: {
            text: draftPayload?.text ?? "",
            image: draftPayload?.image ?? null,
          },
        })
      } else {
        setDraftTransfer(null)
      }
      setSelectedModelId(modelId)
      activateConversation(conversationId)
      setComposerNotice(notice)
      setActiveWorkspaceTab("chat")
      setIsDrawerOpen(false)
    })
  }

  const handleNewConversation = () => {
    if (!currentModel) return
    createFreshConversation(currentModel.id, null)
  }

  const handleConversationSelect = (conversationId: string) => {
    const targetConversation = conversations[conversationId]
    if (!targetConversation) return

    activateConversation(conversationId)
    setSelectedModelId(targetConversation.modelId)
    setComposerNotice(null)
    setDraftTransfer(null)
    setActiveWorkspaceTab("chat")
    setIsDrawerOpen(false)
  }

  const handleModelChange = (modelId: string) => {
    if (modelId === currentModel?.id) return
    const nextModel = modelsById[modelId]
    if (!nextModel) return

    const currentDraft = activeConversationId ? composerDrafts[activeConversationId] ?? null : null

    createFreshConversation(
      nextModel.id,
      hasDraftPayload(currentDraft)
        ? `已切换到 ${nextModel.name}，并保留了当前输入文字和图片草稿。`
        : `已切换到 ${nextModel.name}，并创建了新的空会话。`,
      currentDraft
    )
    setActiveWorkspaceTab("chat")
  }

  const submitPayload = async (
    payload: ComposerPayload,
    targetConversationId: string,
    targetModel: ModelDefinition,
    requestInput: ComposerPayload
  ) => {
    try {
      await submitWithAdapter({
        adapter: streamingServerAdapter,
        conversationId: targetConversationId,
        model: targetModel,
        input: payload,
        requestInput,
      })
    } catch {
      setComposerNotice("真实服务暂时不可用，已切换到本地 mock 兜底。")
      await submitWithAdapter({
        adapter: mockAdapter,
        conversationId: targetConversationId,
        model: targetModel,
        input: payload,
        requestInput,
      })
    }
  }

  const handleSubmit = async (payload: ComposerPayload) => {
    if (!activeConversationId || !currentModel || isBusy) return

    if (payload.image && !currentModel.supportsImageInput) {
      const visionModel = suggestedVisionModel

      if (visionModel) {
        setSelectedModelId(visionModel.id)
        const handoffConversationId = createConversation(visionModel, activeConversationId)
        activateConversation(handoffConversationId)
        setComposerNotice(`当前模型不支持图片分析，已 handoff 到 ${visionModel.displayName || visionModel.name} 新会话。`)
        setActiveWorkspaceTab("chat")
        await submitPayload(payload, handoffConversationId, visionModel, {
          ...payload,
          text: buildClinicalConsultPrompt(payload.text, tonePreset, Boolean(payload.image)),
        })
        return
      }
    }

    setComposerNotice(null)
    setActiveWorkspaceTab("chat")
    await submitPayload(payload, activeConversationId, currentModel, {
      ...payload,
      text: buildClinicalConsultPrompt(payload.text, tonePreset, Boolean(payload.image)),
    })
  }

  const handleStarterPrompt = async (prompt: string = starterPromptFallback) => {
    await handleSubmit({ text: prompt, image: null })
  }

  const handleDeleteConversation = (conversationId: string) => {
    if (!currentModel) return
    deleteConversation(conversationId, currentModel)
  }

  const handleUpdateConversationTags = (conversationId: string, nextTags: string[]) => {
    updateConversationTags(conversationId, nextTags)
  }

  const handleArchiveConversation = (conversationId: string) => {
    if (!currentModel) return
    archiveConversation(conversationId, currentModel)
  }

  const handleRestoreConversation = (conversationId: string) => {
    restoreConversation(conversationId)
  }

  const handleSwitchToSuggestedVision = (payload: ComposerPayload) => {
    if (!suggestedVisionModel || !activeConversationId) return

    const handoffConversationId = createConversation(suggestedVisionModel, activeConversationId)
    setSelectedModelId(suggestedVisionModel.id)
    activateConversation(handoffConversationId)
    setDraftTransfer({ conversationId: handoffConversationId, payload })
    setComposerNotice(`已切换到 ${suggestedVisionModel.displayName || suggestedVisionModel.name}，你可以继续发送图片问诊。`)
    setActiveWorkspaceTab("chat")
  }

  const handleCopyConversation = async () => {
    if (!currentConversation || !currentModel || shareableMessages.length === 0) return

    const copied = await copyTextToClipboard(
      buildConversationPlainText({
        conversation: currentConversation,
        model: currentModel,
        messages: shareableMessages,
      })
    )

    setComposerNotice(
      copied ? "已复制当前会话快照，可直接粘贴到答辩文档或 IM。" : "复制失败，请改用导出 Markdown。"
    )
  }

  const handleExportConversation = () => {
    if (!currentConversation || !currentModel || shareableMessages.length === 0) return

    downloadTextFile(
      getConversationExportFilename(currentConversation),
      buildConversationMarkdown({
        conversation: currentConversation,
        model: currentModel,
        messages: shareableMessages,
      })
    )
    setComposerNotice("已导出当前会话 Markdown，可直接作为演示记录。")
  }

  const handleNativeShareConversation = async () => {
    if (!supportsNativeShare || !currentConversation || !currentModel || shareableMessages.length === 0) {
      return
    }

    try {
      await navigator.share({
        title: currentConversation.title,
        text: buildConversationPlainText({
          conversation: currentConversation,
          model: currentModel,
          messages: shareableMessages,
        }),
      })
      setComposerNotice("已调用系统分享面板。")
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return
      }
      setComposerNotice("系统分享失败，请改用复制会话或导出 Markdown。")
    }
  }

  const handleExportAssistantTurn = useCallback(
    (assistantMessage: Message, pairedQuestion: Message | null) => {
      if (!currentModel) {
        return
      }

      downloadTextFile(
        getAssistantTurnExportFilename({
          question: pairedQuestion,
          answer: assistantMessage,
          conversationTitle: currentConversation?.title,
        }),
        buildAssistantTurnMarkdown({
          question: pairedQuestion,
          answer: assistantMessage,
          model: currentModel,
          conversationTitle: currentConversation?.title,
        })
      )
      setComposerNotice("已导出当前问答 Markdown。")
    },
    [currentConversation?.title, currentModel, setComposerNotice]
  )

  const toggleChatFullscreen = useCallback(() => {
    setIsModelFullscreen(false)
    setIsChatFullscreen((current) => !current)
  }, [])

  const toggleModelFullscreen = useCallback(() => {
    setIsChatFullscreen(false)
    setIsModelFullscreen((current) => !current)
  }, [])

  const handleJumpToConsult = useCallback(() => {
    setIsDrawerOpen(false)
    setIsConsultOpen(false)
    setIsModelFullscreen(false)
    setActiveWorkspaceTab("chat")
    setIsChatFullscreen(true)
  }, [])

  const chatPanel = (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden">
      <ChatStatusStrip
        currentModel={currentModel}
        defaultGeneralModel={defaultGeneralModel}
        messageCount={activeMessages.length}
        notice={shortComposerNotice}
      />

      <MessageList
        conversationId={activeConversationId}
        messages={activeMessages}
        busy={isBusy}
        currentModel={currentModel}
        defaultGeneralModel={defaultGeneralModel}
        onPromptSelect={handleStarterPrompt}
        onExportAssistantTurn={handleExportAssistantTurn}
        onToggleFullscreen={toggleChatFullscreen}
        fillHeight
      />

      <Composer
        key={activeConversationId ?? "composer"}
        model={currentModel}
        defaultGeneralModel={defaultGeneralModel}
        busy={isBusy}
        compact={activeMessages.length > 0}
        notice={composerNotice}
        initialDraft={initialDraft}
        suggestedVisionModel={suggestedVisionModel}
        onDraftChange={handleDraftChange}
        onSwitchToSuggestedVision={handleSwitchToSuggestedVision}
        onSubmit={handleSubmit}
      />
    </div>
  )

  const fullscreenChatPanel = (
    <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
      <MessageList
        conversationId={activeConversationId}
        messages={activeMessages}
        busy={isBusy}
        currentModel={currentModel}
        defaultGeneralModel={defaultGeneralModel}
        onPromptSelect={handleStarterPrompt}
        onExportAssistantTurn={handleExportAssistantTurn}
        onToggleFullscreen={toggleChatFullscreen}
        isFullscreen
        fillHeight
      />

      <Composer
        key={activeConversationId ?? "composer-fullscreen"}
        model={currentModel}
        defaultGeneralModel={defaultGeneralModel}
        busy={isBusy}
        compact={activeMessages.length > 0}
        notice={composerNotice}
        initialDraft={initialDraft}
        suggestedVisionModel={suggestedVisionModel}
        onDraftChange={handleDraftChange}
        onSwitchToSuggestedVision={handleSwitchToSuggestedVision}
        onSubmit={handleSubmit}
      />
    </div>
  )

  const renderModelsSummaryCard = () => (
    <div className="surface-panel-muted rounded-[28px] border border-border/70 p-2.5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-[0.72rem] font-medium uppercase tracking-[0.28em] text-primary/80">模型工作台</p>
            <InfoHint
              label="模型工作台说明"
              content="这里只保留当前模型、模型总量和连通性入口。更详细的能力说明收在模型卡与右侧说明区里，避免顶部说明继续占高。"
              mode="popover"
              align="start"
            />
          </div>
          <h3 className="mt-1 text-base font-semibold tracking-tight text-foreground">
            <span translate="no">{getModelDisplayName(currentModel)}</span>
          </h3>
          <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
            顶部只保留当前模型、总量和检测入口，把更多面积留给真正的模型列表。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="h-6 rounded-full border-primary/25 bg-primary/10 px-2.5 text-primary">
            {getModelRoleLabel(currentModel, defaultGeneralModel?.id)}
          </Badge>
          <Badge variant="outline" className="h-6 rounded-full border-border/70 bg-background/70 px-2.5 text-foreground">
            {models.length} 个模型
          </Badge>
          {lastRefreshTimeLabel ? (
            <Badge variant="outline" className="h-6 rounded-full border-border/70 bg-background/70 px-2.5 text-muted-foreground">
              最近检测 {lastRefreshTimeLabel}
            </Badge>
          ) : null}
          <ModelStatusBadge model={currentModel} />
          {isModelFullscreen ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 rounded-full border-primary/25 bg-primary/10 px-3 text-primary hover:bg-primary/15"
              onClick={handleJumpToConsult}
            >
              去咨询
            </Button>
          ) : null}
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label={isModelFullscreen ? "退出全屏模型选择" : "进入全屏模型选择"}
            title={isModelFullscreen ? "退出全屏模型选择" : "进入全屏模型选择"}
            className="rounded-full border-border/70 bg-background/70 text-foreground hover:bg-muted"
            onClick={toggleModelFullscreen}
          >
            {isModelFullscreen ? <Minimize2Icon /> : <Maximize2Icon />}
          </Button>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] text-muted-foreground">
        <span className="rounded-full border border-border/70 bg-background/70 px-3 py-1">
          默认入口 <span translate="no">{getModelDisplayName(defaultGeneralModel)}</span>
        </span>
        <span className="rounded-full border border-border/70 bg-background/70 px-3 py-1">
          {currentModel.supportsImageInput ? "支持图文联合问诊" : "文本模型，带图会 handoff"}
        </span>
        {modelsError ? (
          <span className="notice-pill rounded-full px-3 py-1">
            模型状态暂未联机，当前显示兜底列表
          </span>
        ) : null}
      </div>
    </div>
  )

  const renderModelsRightRail = () => (
    <div className="flex flex-col gap-4 pb-1">
      <ModelCapabilityCard model={currentModel} defaultGeneralModel={defaultGeneralModel} />
      <DisclaimerCard />
    </div>
  )

  const modelsPanel = (
    <>
      <ScrollArea className="min-h-0 flex-1 overscroll-contain pr-1 xl:hidden">
        <div className="flex flex-col gap-4 pb-4">
          {renderModelsSummaryCard()}
          <div className="min-h-[720px]">
            <ModelSelector
              models={models}
              value={currentModel.id}
              defaultGeneralModelId={defaultGeneralModel?.id}
              refreshAt={refreshAt}
              refreshing={isRefreshingModels}
              onRefresh={() => {
                void refreshModels()
              }}
              onChange={handleModelChange}
              inline
            />
          </div>
          {renderModelsRightRail()}
        </div>
      </ScrollArea>

      <div className="hidden h-full min-h-0 flex-1 xl:grid xl:grid-cols-[minmax(0,2.18fr)_minmax(220px,0.3fr)] xl:gap-4 xl:overflow-hidden">
        <div className="flex min-h-0 flex-col gap-4 overflow-hidden">
          {renderModelsSummaryCard()}
          <div className="min-h-0 flex-1 overflow-hidden">
            <ModelSelector
              models={models}
              value={currentModel.id}
              defaultGeneralModelId={defaultGeneralModel?.id}
              refreshAt={refreshAt}
              refreshing={isRefreshingModels}
              onRefresh={() => {
                void refreshModels()
              }}
              onChange={handleModelChange}
              inline
            />
          </div>
        </div>

        <ScrollArea className="min-h-0 flex-1 overscroll-contain pr-1">
          {renderModelsRightRail()}
        </ScrollArea>
      </div>
    </>
  )

  const fullscreenModelsPanel = (
    <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
      {renderModelsSummaryCard()}

      <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[minmax(0,3.15fr)_minmax(260px,0.72fr)] lg:overflow-hidden">
        <div className="min-h-0 overflow-hidden">
          <ModelSelector
            models={models}
            value={currentModel.id}
            defaultGeneralModelId={defaultGeneralModel?.id}
            refreshAt={refreshAt}
            refreshing={isRefreshingModels}
            onRefresh={() => {
              void refreshModels()
            }}
            onChange={handleModelChange}
            inline
          />
        </div>

        <ScrollArea className="min-h-0 overscroll-contain pr-1">
          {renderModelsRightRail()}
        </ScrollArea>
      </div>
    </div>
  )

  const chatPanels = {
    chat: chatPanel,
    models: modelsPanel,
  } satisfies Record<ChatWorkspaceTabId, ReactNode>

  return (
    <div className="relative h-svh w-full overflow-hidden overflow-x-clip">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,var(--page-aura-primary),transparent_32%),radial-gradient(circle_at_bottom_right,var(--page-aura-secondary),transparent_25%)]" />
      <div
        className={[
          "relative mx-auto flex h-full w-full flex-col overflow-hidden",
          isChatFullscreen || isModelFullscreen
            ? "max-w-[1960px] gap-3 p-3 md:p-4"
            : "max-w-[1760px] gap-4 p-4 xl:px-6",
        ].join(" ")}
      >
        {!isChatFullscreen && !isModelFullscreen ? (
          <TopBar
            currentView={isKnowledgeRoute ? "knowledge" : "chat"}
            currentConversation={currentConversation}
            messageCount={activeMessages.length}
            currentModel={currentModel}
            defaultGeneralModel={defaultGeneralModel}
            theme={theme}
            onThemeChange={setTheme}
            onOpenDrawer={() => setIsDrawerOpen(true)}
            onOpenConsult={() => setIsConsultOpen(true)}
            canOpenConsult={activeMessages.some((message) => message.role === "user")}
            hasConversationActions={shareableMessages.length > 0}
            canNativeShareConversation={supportsNativeShare}
            onCopyConversation={handleCopyConversation}
            onExportConversation={handleExportConversation}
            onNativeShareConversation={handleNativeShareConversation}
          />
        ) : null}

        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {isKnowledgeRoute ? (
            <KnowledgePage />
          ) : isChatFullscreen ? (
            fullscreenChatPanel
          ) : isModelFullscreen ? (
            fullscreenModelsPanel
          ) : (
            <ChatWorkspaceDeck
              activeTab={activeWorkspaceTab}
              onTabChange={setActiveWorkspaceTab}
              currentModelName={getModelDisplayName(currentModel)}
              panels={chatPanels}
            />
          )}
        </main>
      </div>

      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent side="left" className="w-[92vw] overflow-hidden border-border/70 bg-card p-0 sm:!max-w-[430px]">
          <div className="flex h-full min-h-0 flex-col">
            <SheetHeader className="border-b border-border/70 px-4 py-3">
              <SheetTitle>工作抽屉</SheetTitle>
              <SheetDescription>会话树、帮助、免责声明和产品介绍都放在这里，展开时覆盖页面，不再挤压主区。</SheetDescription>
            </SheetHeader>

            <ScrollArea className="min-h-0 flex-1 overscroll-contain">
              <div className="flex min-h-full flex-col gap-3 p-3.5">
                <BrandBlock />
                <NewConversationButton onCreate={handleNewConversation} />
                <ConversationList
                  conversations={orderedConversations}
                  modelsById={modelsById}
                  activeConversationId={activeConversationId}
                  messagesCountById={messagesCountById}
                  onSelect={handleConversationSelect}
                  onRename={renameConversation}
                  onUpdateTags={handleUpdateConversationTags}
                  onArchive={handleArchiveConversation}
                  onRestore={handleRestoreConversation}
                  onDelete={handleDeleteConversation}
                  busyConversationId={activeRequestConversationId}
                  scrollMode="parent"
                />

                <div className="grid gap-2.5 pb-1">
                  <DrawerInfoCard
                    title="使用帮助"
                    summary="首屏只保留高频入口。聊天和模型在主区切换；低频说明统一进入抽屉。"
                    detail={drawerHelpDetail}
                  />
                  <DrawerInfoCard
                    title="免责声明"
                    summary="仅供皮肤健康咨询与科普参考，不替代面诊、检查和处方。"
                    detail={drawerDisclaimerDetail}
                  />
                  <DrawerInfoCard
                    title="产品介绍 / 使用方式"
                    summary="聊天区负责主交互，模型页负责切换与解释，知识页负责结构化科普展示。"
                    detail={drawerIntroDetail}
                  />
                </div>
              </div>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      {!isKnowledgeRoute ? (
        <Sheet open={isConsultOpen} onOpenChange={setIsConsultOpen}>
          <SheetContent side="right" className="w-[96vw] overflow-y-auto border-border/70 bg-card p-0 sm:!max-w-[min(1180px,96vw)]">
            <SheetHeader className="border-b border-border/70">
              <SheetTitle className="text-foreground">多专家会诊</SheetTitle>
              <SheetDescription className="text-muted-foreground">
                围绕当前单条问题并排比较 3 位专家模型，再由 1 位裁决者给出最终总结。
              </SheetDescription>
            </SheetHeader>
            <div className="p-4">
              <ExpertConsultPanel
                models={models}
                currentModel={currentModel}
                messages={activeMessages}
                defaultGeneralModel={defaultGeneralModel}
              />
            </div>
          </SheetContent>
        </Sheet>
      ) : null}

      {!isChatFullscreen && !isModelFullscreen ? (
        <DevRuntimeBadge
          currentView={isKnowledgeRoute ? "knowledge" : "chat"}
          modelCount={models.length}
          knowledgeCount={knowledgeEntries.length}
        />
      ) : null}
    </div>
  )
}

function ChatStatusStrip({
  currentModel,
  defaultGeneralModel,
  messageCount,
  notice,
}: {
  currentModel: ModelDefinition
  defaultGeneralModel?: ModelDefinition | null
  messageCount: number
  notice: string | null
}) {
  return (
    <div className="surface-panel-muted rounded-[20px] border border-border/70 px-3.5 py-2.5 text-xs text-muted-foreground">
      <div className="flex flex-wrap items-center gap-2">
        <Badge
          variant="outline"
          className="h-6 rounded-full border-primary/25 bg-primary/10 px-2.5 text-primary"
        >
          {getModelRoleLabel(currentModel, defaultGeneralModel?.id)}
        </Badge>
        <span className="rounded-full border border-border/70 bg-background/70 px-2.5 py-1">
          当前模型 <span translate="no">{getModelDisplayName(currentModel)}</span>
        </span>
        <span className="rounded-full border border-border/70 bg-background/70 px-2.5 py-1">
          消息 {messageCount}
        </span>
        <span className="rounded-full border border-border/70 bg-background/70 px-2.5 py-1">
          {currentModel.supportsImageInput ? "支持图文联合问诊" : "文本模型，带图会自动 handoff"}
        </span>
        {notice ? (
          <span className="notice-pill rounded-full px-2.5 py-1">
            {notice}
          </span>
        ) : null}
      </div>
      <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-muted-foreground">
        {getModelPrimaryHint(currentModel, defaultGeneralModel?.id)}
      </p>
    </div>
  )
}

function DrawerInfoCard({
  title,
  summary,
  detail,
}: {
  title: string
  summary: string
  detail: string
}) {
  return (
    <div className="surface-panel-muted rounded-[20px] border border-border/70 px-3.5 py-3 text-sm leading-6 text-muted-foreground">
      <div className="flex items-center gap-2">
        <p className="font-medium text-foreground">{title}</p>
        <InfoHint label={title} content={detail} mode="popover" align="start" />
      </div>
      <p className="mt-2">{summary}</p>
    </div>
  )
}
