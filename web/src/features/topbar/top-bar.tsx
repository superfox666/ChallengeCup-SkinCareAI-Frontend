import { BookOpenTextIcon, LayoutPanelLeftIcon, MoonStarIcon, PanelRightOpenIcon, SunIcon, SwatchBookIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ModelSelector } from "@/features/topbar/model-selector"
import { WorkspaceNav } from "@/features/layout/workspace-nav"
import type { Conversation, ModelDefinition } from "@/types/chat"

interface TopBarProps {
  currentView: "chat" | "knowledge"
  currentConversation?: Conversation | null
  currentModel?: ModelDefinition
  models?: ModelDefinition[]
  modelsLoaded?: boolean
  modelsError?: string | null
  refreshAt?: string | null
  theme?: "dark" | "light" | "soft"
  onModelChange?: (modelId: string) => void
  onRefreshModels?: () => void
  onThemeChange?: (theme: "dark" | "light" | "soft") => void
  onOpenSidebar?: () => void
  onOpenRail?: () => void
}

export function TopBar({
  currentView,
  currentConversation,
  currentModel,
  models,
  modelsLoaded,
  modelsError,
  refreshAt,
  theme,
  onModelChange,
  onRefreshModels,
  onThemeChange,
  onOpenSidebar,
  onOpenRail,
}: TopBarProps) {
  const isChatView = currentView === "chat"

  return (
    <header className="app-surface app-panel-surface flex w-full flex-col gap-4 rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(15,26,48,0.94),rgba(10,19,36,0.88))] px-5 py-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex min-w-0 flex-1 flex-col gap-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-[0.72rem] font-medium uppercase tracking-[0.32em] text-primary/80">
            {isChatView ? "智能问诊工作台" : "SkinCareAI Knowledge"}
          </span>
          <div className="flex items-center gap-2 self-start lg:self-auto">
            {isChatView && onOpenSidebar ? (
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                className="border-white/12 bg-white/6 text-slate-100 lg:hidden"
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
                className="border-white/12 bg-white/6 text-slate-100 xl:hidden"
                onClick={onOpenRail}
              >
                <PanelRightOpenIcon />
              </Button>
            ) : null}
            {onThemeChange ? (
              <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-white/5 p-1">
                <Button
                  type="button"
                  variant={theme === "dark" ? "default" : "ghost"}
                  size="icon-sm"
                  className="rounded-xl"
                  onClick={() => onThemeChange("dark")}
                >
                  <MoonStarIcon />
                </Button>
                <Button
                  type="button"
                  variant={theme === "light" ? "default" : "ghost"}
                  size="icon-sm"
                  className="rounded-xl"
                  onClick={() => onThemeChange("light")}
                >
                  <SunIcon />
                </Button>
                <Button
                  type="button"
                  variant={theme === "soft" ? "default" : "ghost"}
                  size="icon-sm"
                  className="rounded-xl"
                  onClick={() => onThemeChange("soft")}
                >
                  <SwatchBookIcon />
                </Button>
              </div>
            ) : null}
            <WorkspaceNav />
          </div>
        </div>
        {isChatView ? (
          <>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="truncate text-2xl font-semibold tracking-tight text-white">
                {currentConversation?.title ?? "新会话"}
              </h2>
              {currentModel ? (
                <Badge variant="outline" className="border-white/12 bg-white/6 text-slate-200">
                  {currentModel.sessionType === "vision" ? "图片问诊" : "文本问诊"}
                </Badge>
              ) : null}
            </div>
            <p className="max-w-3xl text-sm leading-7 text-slate-400">
              一个模型一个会话，切换模型会默认创建新的对话上下文。
            </p>
          </>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="truncate text-2xl font-semibold tracking-tight text-white">
                皮肤科普静态卡片
              </h2>
              <Badge variant="outline" className="border-white/12 bg-white/6 text-slate-200">
                <BookOpenTextIcon data-icon="inline-start" />
                静态版
              </Badge>
            </div>
            <p className="max-w-3xl text-sm leading-7 text-slate-400">
              基于保守白名单文本整理，不接搜索、不接 RAG、不展示来源引用卡片。
            </p>
          </>
        )}
      </div>
      {isChatView && currentModel && models && onModelChange ? (
        <div className="flex w-full flex-col gap-2 lg:w-[260px] lg:shrink-0">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-slate-400">当前模型</span>
            {onRefreshModels ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 rounded-xl px-2 text-xs text-slate-300 hover:bg-white/8 hover:text-white"
                onClick={onRefreshModels}
              >
                刷新状态
              </Button>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <Badge variant="outline" className="border-white/12 bg-white/6 text-slate-100">
              {currentModel.status === "online"
                ? "在线"
                : currentModel.status === "degraded"
                  ? "降级"
                  : currentModel.status === "offline"
                    ? "离线"
                    : "待检测"}
            </Badge>
            <Badge variant="outline" className="border-white/12 bg-white/6 text-slate-100">
              {currentModel.latencyMs ? `${currentModel.latencyMs} ms` : "--"}
            </Badge>
            <Badge variant="outline" className="border-white/12 bg-white/6 text-slate-100">
              速度 {currentModel.speedLevel || "--"}
            </Badge>
            <Badge variant="outline" className="border-white/12 bg-white/6 text-slate-100">
              成本 {currentModel.priceLevel || "--"}
            </Badge>
            {currentModel.supportsImageInput ? (
              <Badge variant="outline" className="border-primary/20 bg-primary/10 text-slate-100">
                支持图片
              </Badge>
            ) : null}
          </div>
          <p className="text-xs leading-6 text-slate-400">
            {currentModel.description || currentModel.summary}
          </p>
          <p className="text-[11px] leading-5 text-slate-500">
            {modelsError
              ? `模型列表已回退到本地兜底：${modelsError}`
              : modelsLoaded
                ? `上次检测：${refreshAt ? new Date(refreshAt).toLocaleTimeString("zh-CN") : "已加载"} · ${currentModel.networkHint || "待实测"}`
                : "正在加载模型状态…"}
          </p>
          <ModelSelector models={models} value={currentModel.id} onChange={onModelChange} />
        </div>
      ) : null}
    </header>
  )
}
