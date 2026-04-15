import {
  BookOpenTextIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
  ChevronUpIcon,
  CopyIcon,
  DownloadIcon,
  ImagesIcon,
  LayoutPanelLeftIcon,
  MessageSquareTextIcon,
  MoonStarIcon,
  PanelRightOpenIcon,
  Share2Icon,
  ShuffleIcon,
  SunIcon,
  SwatchBookIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { InfoHint } from "@/components/ui/info-hint"
import { WorkspaceNav } from "@/features/layout/workspace-nav"
import { ModelSelector } from "@/features/topbar/model-selector"
import { ModelHeroSummary, ModelSignalBadge, ModelStatusBadge } from "@/features/topbar/model-ui"
import {
  getModelDisplayName,
  getModelPrimaryHint,
  getModelRoleLabel,
} from "@/lib/model-config"
import type { Conversation, ModelDefinition } from "@/types/chat"

interface TopBarProps {
  currentView: "chat" | "knowledge"
  currentConversation?: Conversation | null
  messageCount?: number
  currentModel?: ModelDefinition
  defaultGeneralModel?: ModelDefinition | null
  models?: ModelDefinition[]
  modelsLoaded?: boolean
  modelsError?: string | null
  refreshAt?: string | null
  theme?: "dark" | "light" | "soft"
  sidebarCollapsed?: boolean
  workspaceExpanded?: boolean
  onModelChange?: (modelId: string) => void
  onRefreshModels?: () => void
  onThemeChange?: (theme: "dark" | "light" | "soft") => void
  onOpenSidebar?: () => void
  onOpenRail?: () => void
  onToggleSidebarCollapsed?: () => void
  onToggleWorkspaceExpanded?: () => void
  onOpenConsult?: () => void
  canOpenConsult?: boolean
  hasConversationActions?: boolean
  canNativeShareConversation?: boolean
  onCopyConversation?: () => void
  onExportConversation?: () => void
  onNativeShareConversation?: () => void
}

export function TopBar({
  currentView,
  currentConversation,
  messageCount,
  currentModel,
  defaultGeneralModel,
  models,
  modelsLoaded,
  modelsError,
  refreshAt,
  theme,
  sidebarCollapsed,
  workspaceExpanded = false,
  onModelChange,
  onRefreshModels,
  onThemeChange,
  onOpenSidebar,
  onOpenRail,
  onToggleSidebarCollapsed,
  onToggleWorkspaceExpanded,
  onOpenConsult,
  canOpenConsult,
  hasConversationActions,
  canNativeShareConversation,
  onCopyConversation,
  onExportConversation,
  onNativeShareConversation,
}: TopBarProps) {
  const isChatView = currentView === "chat"
  const isKnowledgeView = currentView === "knowledge"
  const isFreshConversation = isChatView && (messageCount ?? 0) === 0
  const showModelWorkspace = Boolean(isChatView && currentModel && models && onModelChange)
  const workspaceModel = showModelWorkspace ? currentModel ?? null : null
  const workspaceModels = showModelWorkspace ? models ?? null : null
  const workspaceOnModelChange = showModelWorkspace ? onModelChange ?? null : null
  const defaultGeneralName = getModelDisplayName(defaultGeneralModel)
  const isFallbackMode = Boolean(modelsError) || currentModel?.providerId === "mock"

  const chatHighlights = [
    {
      title: isFallbackMode ? "本地兜底演示" : "真实 API 已接入",
      description: isFallbackMode ? "server 波动时仍可走完整主链路。" : "文本、图片和流式返回都能直接演示。",
      icon: CheckCircle2Icon,
    },
    {
      title: "默认从通用模型开始",
      description: `${defaultGeneralName} 就是默认入口。`,
      icon: ImagesIcon,
    },
    {
      title: "一个模型一个会话",
      description: "切换模型就新建，不混上下文。",
      icon: ShuffleIcon,
    },
  ]

  return (
    <div
      className={[
        "grid w-full items-start gap-4",
        showModelWorkspace
          ? "grid-cols-1 2xl:grid-cols-[minmax(0,1.32fr)_minmax(280px,332px)]"
          : "grid-cols-1",
      ].join(" ")}
    >
      <header
        className={[
          "surface-hero app-surface flex min-w-0 flex-col border border-border/70 shadow-[var(--surface-shadow-strong)]",
          isKnowledgeView
            ? "rounded-[22px] px-4 py-3 lg:px-5 lg:py-3"
            : "gap-3 rounded-[28px] px-4 py-4 lg:px-5 lg:py-4",
        ].join(" ")}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <span className="text-[0.72rem] font-medium uppercase tracking-[0.32em] text-primary/80">
              {isChatView ? "SkinCareAI Workspace" : "SkinCareAI Knowledge"}
            </span>
            {isChatView ? (
              <>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="max-w-[min(100%,32rem)] break-words text-[1.45rem] leading-[1.05] font-semibold tracking-tight text-foreground lg:text-[1.68rem]">
                    {currentConversation?.title ?? "新会话"}
                  </h2>
                  {currentModel ? (
                    <Badge
                      variant="outline"
                      className="h-7 rounded-full border-primary/25 bg-primary/10 px-2.5 text-primary"
                    >
                      {currentModel.supportsImageInput ? "图文问诊" : "文本问诊"}
                    </Badge>
                  ) : null}
                </div>
                <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                  不用先理解整套系统。先提问，只有在任务变化时再切模型。
                </p>
              </>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-[1.08rem] font-semibold tracking-tight text-foreground lg:text-[1.16rem]">
                  皮肤科普知识页
                </h2>
                <Badge
                  variant="outline"
                  className="h-7 rounded-full border-primary/25 bg-primary/10 px-2.5 text-primary"
                >
                  <BookOpenTextIcon data-icon="inline-start" />
                  展示版
                </Badge>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 self-start">
            {isChatView && onToggleSidebarCollapsed ? (
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label={sidebarCollapsed ? "展开侧边栏" : "收起侧边栏"}
                className="hidden border-border/70 bg-background/70 text-foreground lg:inline-flex"
                onClick={onToggleSidebarCollapsed}
              >
                <LayoutPanelLeftIcon className={sidebarCollapsed ? "opacity-55" : ""} />
              </Button>
            ) : null}
            {isChatView && onOpenSidebar ? (
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label="打开会话侧边栏"
                className="border-border/70 bg-background/70 text-foreground lg:hidden"
                onClick={onOpenSidebar}
              >
                <LayoutPanelLeftIcon />
              </Button>
            ) : null}
            {isChatView && onOpenRail ? (
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label="打开右侧说明区"
                className="border-border/70 bg-background/70 text-foreground xl:hidden"
                onClick={onOpenRail}
              >
                <PanelRightOpenIcon />
              </Button>
            ) : null}
            {onThemeChange ? (
              <div className="flex items-center gap-2">
                <div className="surface-panel-muted inline-flex items-center gap-1 rounded-2xl border border-border/70 p-1">
                  <Button
                    type="button"
                    variant={theme === "dark" ? "default" : "ghost"}
                    size="icon-sm"
                    aria-label="切换到深色主题"
                    className="rounded-xl"
                    onClick={() => onThemeChange("dark")}
                  >
                    <MoonStarIcon />
                  </Button>
                  <Button
                    type="button"
                    variant={theme === "light" ? "default" : "ghost"}
                    size="icon-sm"
                    aria-label="切换到浅色主题"
                    className="rounded-xl"
                    onClick={() => onThemeChange("light")}
                  >
                    <SunIcon />
                  </Button>
                  <Button
                    type="button"
                    variant={theme === "soft" ? "default" : "ghost"}
                    size="icon-sm"
                    aria-label="切换到柔和主题"
                    className="rounded-xl"
                    onClick={() => onThemeChange("soft")}
                  >
                    <SwatchBookIcon />
                  </Button>
                </div>
                <InfoHint
                  label="主题切换说明"
                  content="深色适合投屏，浅色适合日常检查，柔和主题适合内容讲解。"
                />
              </div>
            ) : null}
            <WorkspaceNav />
          </div>
        </div>

        {isChatView && isFreshConversation ? (
          <div className="flex flex-wrap gap-2">
            {chatHighlights.map((item) => {
              const Icon = item.icon

              return (
                <div
                  key={item.title}
                  className="surface-panel-muted inline-flex min-h-0 items-center gap-2 rounded-full border border-border/70 px-3 py-2 text-xs"
                >
                  <Icon className="size-3.5 text-primary" />
                  <span className="font-medium text-foreground">{item.title}</span>
                  <span className="hidden max-w-[11rem] text-muted-foreground 2xl:inline">
                    {item.description}
                  </span>
                </div>
              )
            })}
          </div>
        ) : null}

        {isChatView && hasConversationActions ? (
          <div className="flex flex-wrap items-center gap-2">
            {onCopyConversation ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 rounded-full border-border/70 bg-background/70 px-3 text-foreground hover:bg-muted"
                onClick={onCopyConversation}
              >
                <CopyIcon data-icon="inline-start" />
                复制会话
              </Button>
            ) : null}
            {onExportConversation ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 rounded-full border-border/70 bg-background/70 px-3 text-foreground hover:bg-muted"
                onClick={onExportConversation}
              >
                <DownloadIcon data-icon="inline-start" />
                导出 Markdown
              </Button>
            ) : null}
            {canNativeShareConversation && onNativeShareConversation ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 rounded-full border-border/70 bg-background/70 px-3 text-foreground hover:bg-muted md:hidden"
                onClick={onNativeShareConversation}
              >
                <Share2Icon data-icon="inline-start" />
                系统分享
              </Button>
            ) : null}
            <InfoHint
              label="分享与导出策略"
              content="当前优先保留复制会话、导出 Markdown 和设备原生分享，不把主链路做成新的云端页面。"
              align="start"
            />
          </div>
        ) : null}
      </header>

      {workspaceModel && workspaceModels && workspaceOnModelChange ? (
        <div className="surface-panel app-surface relative flex w-full min-w-0 flex-col gap-3 rounded-[28px] border border-border/70 p-3 shadow-[var(--surface-shadow-soft)]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-primary/80">模型工作台</p>
                <InfoHint
                  label="模型工作台"
                  content="默认只保留当前模型摘要。复杂说明和切换面板只在需要时展开，避免首屏被拉长。"
                  align="start"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="h-7 rounded-full border-primary/25 bg-primary/10 px-2.5 text-primary"
                >
                  {getModelRoleLabel(workspaceModel, defaultGeneralModel?.id)}
                </Badge>
                <ModelStatusBadge model={workspaceModel} />
                <ModelSignalBadge hint={workspaceModel.networkHint} />
              </div>
              <div>
                <p className="text-base font-semibold text-foreground">
                  {getModelDisplayName(workspaceModel)}
                </p>
                <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                  {getModelPrimaryHint(workspaceModel, defaultGeneralModel?.id)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {onRefreshModels ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-full border-border/70 bg-background/70 text-foreground hover:bg-muted"
                  onClick={onRefreshModels}
                >
                  刷新状态
                </Button>
              ) : null}
              {onToggleWorkspaceExpanded ? (
                <Button
                  type="button"
                  variant={workspaceExpanded ? "default" : "outline"}
                  size="sm"
                  className="h-8 rounded-full px-3"
                  onClick={onToggleWorkspaceExpanded}
                >
                  {workspaceExpanded ? (
                    <>
                      <ChevronUpIcon data-icon="inline-start" />
                      收起工作台
                    </>
                  ) : (
                    <>
                      <ChevronDownIcon data-icon="inline-start" />
                      展开工作台
                    </>
                  )}
                </Button>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="h-7 rounded-full border-border/70 bg-background/70 px-2.5 text-foreground"
            >
              默认入口：{defaultGeneralName}
            </Badge>
            {workspaceModel.supportsImageInput ? (
              <Badge
                variant="outline"
                className="h-7 rounded-full border-border/70 bg-background/70 px-2.5 text-muted-foreground"
              >
                图文都可直接开始
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="h-7 rounded-full border-border/70 bg-background/70 px-2.5 text-muted-foreground"
              >
                带图会自动 handoff 到视觉模型
              </Badge>
            )}
          </div>

          {workspaceExpanded ? (
            <div className="absolute inset-x-0 top-[calc(100%+0.75rem)] z-30 2xl:left-auto 2xl:right-0 2xl:w-[min(460px,calc(100vw-3rem))]">
              <div className="surface-panel app-surface flex max-h-[min(72svh,760px)] flex-col gap-3 overflow-y-auto rounded-[26px] border border-border/70 bg-card/96 p-3.5 shadow-[var(--surface-shadow-strong)] backdrop-blur-xl supports-[backdrop-filter]:bg-card/88">
              {!isFreshConversation && onOpenConsult ? (
                <div className="flex flex-wrap items-center gap-2">
                  <InfoHint
                    label="轻量会诊说明"
                    content="会诊只围绕当前问题做横向比较，是加分项，不替代主聊天链路。"
                    align="start"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 rounded-full border-border/70 bg-background/70 px-3 text-foreground hover:bg-muted"
                    onClick={onOpenConsult}
                    disabled={!canOpenConsult}
                  >
                    <MessageSquareTextIcon data-icon="inline-start" />
                    发起轻量会诊
                  </Button>
                </div>
              ) : null}

              {isFreshConversation ? (
                <div className="rounded-[22px] border border-border/70 bg-background/65 px-4 py-3 text-sm leading-6 text-muted-foreground">
                  当前是空会话，默认入口已经选好。先问一个问题，再决定要不要细分模型。
                </div>
              ) : (
                <ModelHeroSummary
                  model={workspaceModel}
                  defaultGeneralModelId={defaultGeneralModel?.id}
                />
              )}

              {defaultGeneralModel && workspaceModel.id !== defaultGeneralModel.id ? (
                <div className="rounded-[22px] border border-primary/25 bg-primary/10 px-4 py-3 text-sm leading-6 text-foreground">
                  <p className="font-medium text-primary">不确定时，回到默认通用模型</p>
                  <p className="text-muted-foreground">
                    {defaultGeneralName} 更适合作为默认演示入口，不确定就切回它。
                  </p>
                </div>
              ) : null}

              <p className="text-[11px] leading-6 text-muted-foreground">
                {modelsError
                  ? "模型状态暂时不可联机，当前已回退到本地兜底模型列表。"
                  : modelsLoaded
                    ? `上次刷新：${refreshAt ? new Date(refreshAt).toLocaleTimeString("zh-CN") : "已加载"}`
                    : "正在加载模型状态…"}
              </p>

              <ModelSelector
                models={workspaceModels}
                value={workspaceModel.id}
                defaultGeneralModelId={defaultGeneralModel?.id}
                onChange={workspaceOnModelChange}
              />
              </div>
            </div>
          ) : (
            <div className="rounded-[22px] border border-border/70 bg-background/60 px-4 py-3 text-sm leading-6 text-muted-foreground">
              默认首屏只保留当前模型摘要和展开入口。模型切换器仍然是浮层，不再把聊天主区整体往下压。
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}
