import { startTransition, useEffect, useMemo, useState } from "react"
import { useLocation } from "react-router-dom"

import { mockAdapter } from "@/lib/mock-adapter"
import { serverAdapter } from "@/lib/server-adapter"
import { streamChatMessage } from "@/lib/server-api"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import type { ComposerPayload, ModelDefinition } from "@/types/chat"
import { useChatStore } from "@/stores/use-chat-store"
import { useModelStore } from "@/stores/use-model-store"
import { useUiStore } from "@/stores/use-ui-store"
import { Composer } from "@/features/chat/composer"
import { MessageList } from "@/features/chat/message-list"
import { ChatContextRailPanel } from "@/features/layout/chat-context-rail-panel"
import { ChatSidebarPanel } from "@/features/layout/chat-sidebar-panel"
import { KnowledgePage } from "@/features/knowledge/knowledge-page"
import { TopBar } from "@/features/topbar/top-bar"

const starterPromptFallback = "最近脸上反复长痘，日常护理应该怎么调整？"

function buildModelMap(models: ModelDefinition[]) {
  return Object.fromEntries(models.map((model) => [model.id, model]))
}

export function AppShell() {
  const location = useLocation()
  const isKnowledgeRoute = location.pathname === "/knowledge"
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isRailOpen, setIsRailOpen] = useState(false)

  const models = useModelStore((state) => state.models)
  const selectedModelId = useModelStore((state) => state.selectedModelId)
  const setSelectedModelId = useModelStore((state) => state.setSelectedModelId)
  const modelsLoaded = useModelStore((state) => state.modelsLoaded)
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
  const deleteConversation = useChatStore((state) => state.deleteConversation)
  const submitWithAdapter = useChatStore((state) => state.submitWithAdapter)
  const upsertAssistantStream = useChatStore((state) => state.upsertAssistantStream)

  const composerNotice = useUiStore((state) => state.composerNotice)
  const draftTransfer = useUiStore((state) => state.draftTransfer)
  const theme = useUiStore((state) => state.theme)
  const setComposerNotice = useUiStore((state) => state.setComposerNotice)
  const setDraftTransfer = useUiStore((state) => state.setDraftTransfer)
  const setTheme = useUiStore((state) => state.setTheme)

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
  const activeMessages = activeConversationId
    ? messagesByConversationId[activeConversationId] ?? []
    : []
  const isBusy = activeRequestConversationId !== null
  const suggestedVisionModel = modelsById[getRecommendedVisionModelId()] ?? null
  const initialDraft =
    draftTransfer && draftTransfer.conversationId === activeConversationId
      ? draftTransfer.payload
      : null

  useEffect(() => {
    void loadModels(false)
  }, [loadModels])

  useEffect(() => {
    void loadModels(true)
  }, [loadModels])

  useEffect(() => {
    bootstrap(currentModel)
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

  const createFreshConversation = (modelId: string, notice: string | null) => {
    const model = modelsById[modelId]

    if (!model) {
      return
    }

    startTransition(() => {
      const conversationId = createConversation(model)
      setSelectedModelId(modelId)
      activateConversation(conversationId)
      setComposerNotice(notice)
    })
  }

  const handleNewConversation = () => {
    createFreshConversation(currentModel.id, null)
  }

  const handleConversationSelect = (conversationId: string) => {
    const targetConversation = conversations[conversationId]

    if (!targetConversation) {
      return
    }

    activateConversation(conversationId)
    setSelectedModelId(targetConversation.modelId)
    setComposerNotice(null)
    setDraftTransfer(null)
    setIsSidebarOpen(false)
  }

  const handleModelChange = (modelId: string) => {
    if (modelId === currentModel.id) {
      return
    }

    const nextModel = modelsById[modelId]

    if (!nextModel) {
      return
    }

    createFreshConversation(
      nextModel.id,
      `已切换到 ${nextModel.name}，并创建新的空会话。`
    )
  }

  const submitPayload = async (
    payload: ComposerPayload,
    targetConversationId: string,
    targetModel: ModelDefinition
  ) => {
    if (!payload.image) {
      const streamMessageId = `msg-${crypto.randomUUID()}`
      let streamText = ""

      try {
        await submitWithAdapter({
          adapter: {
            ...serverAdapter,
            async sendMessage(input) {
              await streamChatMessage(
                {
                  modelId: input.model.modelId || input.model.id,
                  history: input.history.map((message) => ({
                    role: message.role,
                    parts: message.parts
                      .filter((part) => part.type === "text")
                      .map((part) => ({ type: part.type, text: part.text })),
                  })),
                  input: input.input,
                },
                {
                  onMeta: () => {
                    upsertAssistantStream({
                      conversationId: targetConversationId,
                      model: targetModel,
                      messageId: streamMessageId,
                      text: "",
                      state: "streaming",
                    })
                  },
                  onDelta: (delta) => {
                    streamText += delta
                    upsertAssistantStream({
                      conversationId: targetConversationId,
                      model: targetModel,
                      messageId: streamMessageId,
                      text: streamText,
                      state: "streaming",
                    })
                  },
                  onDone: (finalText) => {
                    upsertAssistantStream({
                      conversationId: targetConversationId,
                      model: targetModel,
                      messageId: streamMessageId,
                      text: finalText || streamText,
                      state: "complete",
                    })
                  },
                }
              )

              return {
                text: streamText,
                streamed: true,
              }
            },
          },
          conversationId: targetConversationId,
          model: targetModel,
          input: payload,
        })

        return
      } catch {
        // fall through to non-stream request below
      }
    }

    try {
      await submitWithAdapter({
        adapter: serverAdapter,
        conversationId: targetConversationId,
        model: targetModel,
        input: payload,
      })
    } catch {
      setComposerNotice("真实服务暂时不可用，已切换到本地 mock 兜底。")
      await submitWithAdapter({
        adapter: mockAdapter,
        conversationId: targetConversationId,
        model: targetModel,
        input: payload,
      })
    }
  }

  const handleSubmit = async (payload: ComposerPayload) => {
    if (!activeConversationId || isBusy) {
      return
    }

    if (payload.image && !currentModel.supportsImageInput) {
      const visionModel = suggestedVisionModel

      if (visionModel) {
        setSelectedModelId(visionModel.id)
        const handoffConversationId = createConversation(visionModel, activeConversationId)
        activateConversation(handoffConversationId)
        setComposerNotice(
          `当前模型不支持图片分析，已 handoff 到 ${visionModel.displayName || visionModel.name} 新会话。`
        )

        await submitPayload(payload, handoffConversationId, visionModel)
        return
      }
    }

    setComposerNotice(null)
    await submitPayload(payload, activeConversationId, currentModel)
  }

  const handleStarterPrompt = async (prompt: string = starterPromptFallback) => {
    await handleSubmit({ text: prompt, image: null })
  }

  const handleRenameConversation = (conversationId: string, nextTitle: string) => {
    renameConversation(conversationId, nextTitle)
  }

  const handleDeleteConversation = (conversationId: string) => {
    deleteConversation(conversationId, currentModel)
  }

  const handleSwitchToSuggestedVision = (payload: ComposerPayload) => {
    if (!suggestedVisionModel || !activeConversationId) {
      return
    }

    const handoffConversationId = createConversation(suggestedVisionModel, activeConversationId)
    setSelectedModelId(suggestedVisionModel.id)
    activateConversation(handoffConversationId)
    setDraftTransfer({
      conversationId: handoffConversationId,
      payload,
    })
    setComposerNotice(
      `已切换到 ${suggestedVisionModel.displayName || suggestedVisionModel.name}，你可以直接继续发送图片问诊。`
    )
  }

  return (
    <div className="relative min-h-svh w-full overflow-x-clip">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(38,198,190,0.14),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,159,54,0.1),transparent_25%)]" />
      <div
        className={[
          "relative grid min-h-svh w-full gap-4 p-4 2xl:px-6",
          isKnowledgeRoute
            ? "grid-cols-1"
            : "grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1.18fr)_360px] 2xl:grid-cols-[340px_minmax(0,1.3fr)_380px]",
        ].join(" ")}
      >
        {!isKnowledgeRoute ? (
          <aside className="hidden min-h-[calc(100svh-2rem)] w-full min-w-0 flex-col gap-4 lg:flex">
            <ChatSidebarPanel
              conversations={orderedConversations}
              modelsById={modelsById}
              activeConversationId={activeConversationId}
              messagesCountById={messagesCountById}
              onSelectConversation={handleConversationSelect}
              onCreateConversation={handleNewConversation}
              onRenameConversation={handleRenameConversation}
              onDeleteConversation={handleDeleteConversation}
              busy={isBusy}
            />
          </aside>
        ) : null}

        <main
          className={[
            "flex min-h-[calc(100svh-2rem)] w-full min-w-0 flex-col gap-4",
            isKnowledgeRoute ? "mx-auto w-full max-w-7xl" : "",
          ].join(" ")}
        >
          <TopBar
            currentView={isKnowledgeRoute ? "knowledge" : "chat"}
            currentConversation={currentConversation}
            currentModel={currentModel}
            models={models}
            modelsLoaded={modelsLoaded}
            modelsError={modelsError}
            refreshAt={refreshAt}
            theme={theme}
            onModelChange={handleModelChange}
            onRefreshModels={() => void loadModels(true)}
            onThemeChange={setTheme}
            onOpenSidebar={() => setIsSidebarOpen(true)}
            onOpenRail={() => setIsRailOpen(true)}
          />
          {isKnowledgeRoute ? (
            <KnowledgePage />
          ) : (
            <>
              <MessageList
                messages={activeMessages}
                busy={isBusy}
                onPromptSelect={handleStarterPrompt}
              />
              <Composer
                key={activeConversationId ?? "composer"}
                model={currentModel}
                busy={isBusy}
                notice={composerNotice}
                initialDraft={initialDraft}
                suggestedVisionModel={suggestedVisionModel}
                onSwitchToSuggestedVision={handleSwitchToSuggestedVision}
                onSubmit={handleSubmit}
              />
            </>
          )}
        </main>

        {!isKnowledgeRoute ? (
          <aside className="hidden w-full min-w-0 gap-4 xl:grid">
            <ChatContextRailPanel model={currentModel} />
          </aside>
        ) : null}
      </div>

      {!isKnowledgeRoute ? (
        <>
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetContent side="left" className="w-[90vw] overflow-y-auto border-white/10 bg-[#091523] p-0 sm:max-w-sm">
              <SheetHeader className="border-b border-white/10 pb-3">
                <SheetTitle className="text-white">会话列表</SheetTitle>
                <SheetDescription className="text-slate-400">
                  在移动端切换、重命名或删除本地会话。
                </SheetDescription>
              </SheetHeader>
              <div className="p-4">
                <ChatSidebarPanel
                  conversations={orderedConversations}
                  modelsById={modelsById}
                  activeConversationId={activeConversationId}
                  messagesCountById={messagesCountById}
                  onSelectConversation={handleConversationSelect}
                  onCreateConversation={handleNewConversation}
                  onRenameConversation={handleRenameConversation}
                  onDeleteConversation={handleDeleteConversation}
                  busy={isBusy}
                />
              </div>
            </SheetContent>
          </Sheet>

          <Sheet open={isRailOpen} onOpenChange={setIsRailOpen}>
            <SheetContent side="right" className="w-[90vw] overflow-y-auto border-white/10 bg-[#091523] p-0 sm:max-w-sm">
              <SheetHeader className="border-b border-white/10 pb-3">
                <SheetTitle className="text-white">当前说明</SheetTitle>
                <SheetDescription className="text-slate-400">
                  品牌展示、模型能力和免责声明收纳在这里。
                </SheetDescription>
              </SheetHeader>
              <div className="p-4">
                <ChatContextRailPanel model={currentModel} />
              </div>
            </SheetContent>
          </Sheet>
        </>
      ) : null}
    </div>
  )
}
