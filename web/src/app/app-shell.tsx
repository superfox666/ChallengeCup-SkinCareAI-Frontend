import { startTransition, useEffect, useMemo, useState } from "react"
import { useLocation } from "react-router-dom"

import { mockAdapter } from "@/lib/mock-adapter"
import { getDefaultGeneralModel } from "@/lib/model-config"
import { serverAdapter } from "@/lib/server-adapter"
import {
  buildConversationMarkdown,
  buildConversationPlainText,
  copyTextToClipboard,
  downloadTextFile,
  getConversationExportFilename,
} from "@/lib/share-utils"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import type { ComposerPayload, ModelDefinition } from "@/types/chat"
import { useChatStore } from "@/stores/use-chat-store"
import { useModelStore } from "@/stores/use-model-store"
import { useUiStore } from "@/stores/use-ui-store"
import { Composer } from "@/features/chat/composer"
import { MessageList } from "@/features/chat/message-list"
import { ExpertConsultPanel } from "@/features/consult/expert-consult-panel"
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
  const [isConsultOpen, setIsConsultOpen] = useState(false)

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

  const composerNotice = useUiStore((state) => state.composerNotice)
  const draftTransfer = useUiStore((state) => state.draftTransfer)
  const theme = useUiStore((state) => state.theme)
  const sidebarCollapsed = useUiStore((state) => state.sidebarCollapsed)
  const modelWorkspaceExpanded = useUiStore((state) => state.modelWorkspaceExpanded)
  const setComposerNotice = useUiStore((state) => state.setComposerNotice)
  const setDraftTransfer = useUiStore((state) => state.setDraftTransfer)
  const setTheme = useUiStore((state) => state.setTheme)
  const toggleSidebarCollapsed = useUiStore((state) => state.toggleSidebarCollapsed)
  const toggleModelWorkspaceExpanded = useUiStore((state) => state.toggleModelWorkspaceExpanded)

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
  const isFreshConversation = activeMessages.length === 0
  const isCompactConversation = activeMessages.length <= 3
  const shareableMessages = useMemo(
    () => activeMessages.filter((message) => message.role !== "system"),
    [activeMessages]
  )
  const isBusy = activeRequestConversationId !== null
  const suggestedVisionModel = modelsById[getRecommendedVisionModelId()] ?? null
  const supportsNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function"
  const initialDraft =
    draftTransfer && draftTransfer.conversationId === activeConversationId
      ? draftTransfer.payload
      : null

  useEffect(() => {
    void loadModels(false)
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

  const handleCopyConversation = async () => {
    if (!currentConversation || !currentModel || shareableMessages.length === 0) {
      return
    }

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
    if (!currentConversation || !currentModel || shareableMessages.length === 0) {
      return
    }

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
    if (
      !supportsNativeShare ||
      !currentConversation ||
      !currentModel ||
      shareableMessages.length === 0
    ) {
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

  return (
    <div className="relative min-h-svh w-full overflow-x-clip">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,var(--page-aura-primary),transparent_32%),radial-gradient(circle_at_bottom_right,var(--page-aura-secondary),transparent_25%)]" />
      <div
        className={[
          "relative mx-auto grid min-h-svh w-full max-w-[1880px] items-start gap-4 p-4 2xl:px-6",
          isKnowledgeRoute
            ? "grid-cols-1"
            : sidebarCollapsed
              ? "grid-cols-1 xl:grid-cols-[minmax(0,2.08fr)_288px] 2xl:grid-cols-[minmax(0,2.16fr)_312px]"
              : "grid-cols-1 lg:grid-cols-[272px_minmax(0,1fr)] xl:grid-cols-[272px_minmax(0,1.9fr)_288px] 2xl:grid-cols-[284px_minmax(0,1.96fr)_312px]",
        ].join(" ")}
      >
        {!isKnowledgeRoute && !sidebarCollapsed ? (
          <aside className="hidden h-[calc(100svh-2rem)] w-full min-w-0 self-start overflow-hidden lg:flex xl:sticky xl:top-4">
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
            "flex w-full min-w-0 self-start flex-col gap-4",
            isKnowledgeRoute ? "mx-auto w-full max-w-none" : "",
          ].join(" ")}
        >
          <TopBar
            currentView={isKnowledgeRoute ? "knowledge" : "chat"}
            currentConversation={currentConversation}
            messageCount={activeMessages.length}
            currentModel={currentModel}
            defaultGeneralModel={defaultGeneralModel}
            models={models}
            modelsLoaded={modelsLoaded}
            modelsError={modelsError}
            refreshAt={refreshAt}
            theme={theme}
            sidebarCollapsed={sidebarCollapsed}
            workspaceExpanded={modelWorkspaceExpanded}
            onModelChange={handleModelChange}
            onRefreshModels={() => void loadModels(true)}
            onThemeChange={setTheme}
            onOpenSidebar={() => setIsSidebarOpen(true)}
            onOpenRail={() => setIsRailOpen(true)}
            onToggleSidebarCollapsed={toggleSidebarCollapsed}
            onToggleWorkspaceExpanded={toggleModelWorkspaceExpanded}
            onOpenConsult={() => setIsConsultOpen(true)}
            canOpenConsult={activeMessages.some((message) => message.role === "user")}
            hasConversationActions={shareableMessages.length > 0}
            canNativeShareConversation={supportsNativeShare}
            onCopyConversation={handleCopyConversation}
            onExportConversation={handleExportConversation}
            onNativeShareConversation={handleNativeShareConversation}
          />
          {isKnowledgeRoute ? (
            <KnowledgePage />
          ) : (
            <>
              {isCompactConversation ? (
                <>
                  <Composer
                    key={activeConversationId ?? "composer"}
                    model={currentModel}
                    defaultGeneralModel={defaultGeneralModel}
                    busy={isBusy}
                    compact={!isFreshConversation}
                    notice={composerNotice}
                    initialDraft={initialDraft}
                    suggestedVisionModel={suggestedVisionModel}
                    onSwitchToSuggestedVision={handleSwitchToSuggestedVision}
                    onSubmit={handleSubmit}
                  />
                  <MessageList
                    conversationId={activeConversationId}
                    messages={activeMessages}
                    busy={isBusy}
                    currentModel={currentModel}
                    defaultGeneralModel={defaultGeneralModel}
                    onPromptSelect={handleStarterPrompt}
                  />
                </>
              ) : (
                <>
                  <MessageList
                    conversationId={activeConversationId}
                    messages={activeMessages}
                    busy={isBusy}
                    currentModel={currentModel}
                    defaultGeneralModel={defaultGeneralModel}
                    onPromptSelect={handleStarterPrompt}
                  />
                  <Composer
                    key={activeConversationId ?? "composer"}
                    model={currentModel}
                    defaultGeneralModel={defaultGeneralModel}
                    busy={isBusy}
                    compact={!isFreshConversation}
                    notice={composerNotice}
                    initialDraft={initialDraft}
                    suggestedVisionModel={suggestedVisionModel}
                    onSwitchToSuggestedVision={handleSwitchToSuggestedVision}
                    onSubmit={handleSubmit}
                  />
                </>
              )}
            </>
          )}
        </main>

        {!isKnowledgeRoute ? (
          <aside className="hidden h-[calc(100svh-2rem)] w-full min-w-0 self-start overflow-hidden xl:flex xl:sticky xl:top-4">
            <ChatContextRailPanel model={currentModel} defaultGeneralModel={defaultGeneralModel} />
          </aside>
        ) : null}
      </div>

      {!isKnowledgeRoute ? (
        <>
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetContent side="left" className="w-[90vw] overflow-y-auto border-border/70 bg-card p-0 sm:max-w-sm">
              <SheetHeader className="border-b border-border/70 pb-3">
                <SheetTitle className="text-foreground">会话列表</SheetTitle>
                <SheetDescription className="text-muted-foreground">
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
            <SheetContent side="right" className="w-[90vw] overflow-y-auto border-border/70 bg-card p-0 sm:max-w-sm">
              <SheetHeader className="border-b border-border/70 pb-3">
                <SheetTitle className="text-foreground">当前说明</SheetTitle>
                <SheetDescription className="text-muted-foreground">
                  品牌展示、模型能力和免责声明收纳在这里。
                </SheetDescription>
              </SheetHeader>
              <div className="p-4">
                <ChatContextRailPanel model={currentModel} defaultGeneralModel={defaultGeneralModel} />
              </div>
            </SheetContent>
          </Sheet>

          <Sheet open={isConsultOpen} onOpenChange={setIsConsultOpen}>
            <SheetContent
              side="right"
              className="w-[96vw] overflow-y-auto border-border/70 bg-card p-0 sm:!max-w-[min(1120px,96vw)]"
            >
              <SheetHeader className="border-b border-border/70 pb-3">
                <SheetTitle className="text-foreground">轻量专家会诊</SheetTitle>
                <SheetDescription className="text-muted-foreground">
                  围绕当前单条问题并排比较 2 到 3 个代表模型的简要结论和差异点。
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
        </>
      ) : null}
    </div>
  )
}
