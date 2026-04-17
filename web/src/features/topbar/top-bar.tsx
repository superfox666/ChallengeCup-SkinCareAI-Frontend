import { useEffect, useRef, useState, type ReactNode } from "react"
import {
  CopyIcon,
  DownloadIcon,
  EllipsisIcon,
  MenuIcon,
  MessageSquareQuoteIcon,
  MoonStarIcon,
  Share2Icon,
  SunIcon,
  SwatchBookIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { InfoHint } from "@/components/ui/info-hint"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { WorkspaceNav } from "@/features/layout/workspace-nav"
import { brandAiAvatarSrc } from "@/lib/brand-assets"
import { getModelDisplayName } from "@/lib/model-config"
import type { Conversation, ModelDefinition } from "@/types/chat"

interface TopBarProps {
  currentView: "chat" | "knowledge"
  currentConversation?: Conversation | null
  messageCount?: number
  currentModel?: ModelDefinition
  defaultGeneralModel?: ModelDefinition | null
  theme?: "dark" | "light" | "soft"
  onThemeChange?: (theme: "dark" | "light" | "soft") => void
  onOpenDrawer?: () => void
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
  messageCount = 0,
  currentModel,
  defaultGeneralModel,
  theme = "dark",
  onThemeChange,
  onOpenDrawer,
  onOpenConsult,
  canOpenConsult = false,
  hasConversationActions = false,
  canNativeShareConversation = false,
  onCopyConversation,
  onExportConversation,
  onNativeShareConversation,
}: TopBarProps) {
  const isChatView = currentView === "chat"
  const title = isChatView ? currentConversation?.title || "新会话" : "皮肤科普知识页"
  const modelName = currentModel ? getModelDisplayName(currentModel) : getModelDisplayName(defaultGeneralModel)
  const [moreToolsOpen, setMoreToolsOpen] = useState(false)
  const [isCompactViewport, setIsCompactViewport] = useState(false)
  const moreToolsRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 639px)")
    const updateViewportMode = () => setIsCompactViewport(mediaQuery.matches)

    updateViewportMode()
    mediaQuery.addEventListener("change", updateViewportMode)

    return () => mediaQuery.removeEventListener("change", updateViewportMode)
  }, [])

  useEffect(() => {
    if (!moreToolsOpen || isCompactViewport) {
      return
    }

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node

      if (!moreToolsRef.current?.contains(target)) {
        setMoreToolsOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMoreToolsOpen(false)
      }
    }

    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isCompactViewport, moreToolsOpen])

  const moreToolItems = isChatView
    ? [
        {
          label: "专家会诊",
          icon: <MessageSquareQuoteIcon className="size-4" />,
          disabled: !canOpenConsult,
          onClick: onOpenConsult,
        },
        {
          label: "复制会话",
          icon: <CopyIcon className="size-4" />,
          disabled: !hasConversationActions,
          onClick: onCopyConversation,
        },
        {
          label: "导出 Markdown",
          icon: <DownloadIcon className="size-4" />,
          disabled: !hasConversationActions,
          onClick: onExportConversation,
        },
        {
          label: "系统分享",
          icon: <Share2Icon className="size-4" />,
          disabled: !hasConversationActions || !canNativeShareConversation,
          onClick: onNativeShareConversation,
        },
      ]
    : []

  return (
    <header className="surface-hero app-surface relative rounded-[28px] border border-border/70 px-4 py-2.5 shadow-[var(--surface-shadow-strong)] lg:px-5 lg:py-3">
      <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3.5">
          {onOpenDrawer ? (
            <IconActionButton
              label="打开抽屉"
              icon={<MenuIcon className="size-4" />}
              onClick={onOpenDrawer}
              className="rounded-full"
            />
          ) : null}

          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex size-[3.85rem] shrink-0 items-center justify-center rounded-[22px] border border-border/70 bg-background/72 shadow-[var(--surface-shadow-soft)]">
              <img
                src={brandAiAvatarSrc}
                alt="SkinCareAI logo"
                className="size-[2.95rem] object-contain"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  translate="no"
                  className="text-[0.64rem] font-medium uppercase tracking-[0.32em] text-primary/80"
                >
                  SkinCareAI
                </span>
                <Badge
                  variant="outline"
                  className="h-5.5 rounded-full border-primary/25 bg-primary/10 px-2.5 text-[11px] text-primary"
                >
                  演示版
                </Badge>
              </div>

              <div className="mt-1 flex min-w-0 flex-wrap items-center gap-2">
                <h1 className="min-w-0 truncate text-[1.08rem] font-semibold tracking-tight text-foreground lg:text-[1.18rem]">
                  {title}
                </h1>
                {isChatView && currentModel ? (
                  <Badge
                    variant="outline"
                    className="h-5.5 rounded-full border-border/70 bg-background/75 px-2.5 text-[11px] text-muted-foreground"
                  >
                    {currentModel.supportsImageInput ? "图文问诊" : "文本问诊"}
                  </Badge>
                ) : null}
              </div>

              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                <span className="rounded-full border border-border/70 bg-background/70 px-2.5 py-1">
                  当前模型 <span translate="no">{modelName}</span>
                </span>
                {isChatView ? (
                  <span className="rounded-full border border-border/70 bg-background/70 px-2.5 py-1">
                    消息 {messageCount}
                  </span>
                ) : null}
                <span className="notice-pill rounded-full px-2.5 py-1">
                  仅供参考，不替代线下就医
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-start gap-2">
          <WorkspaceNav />

          {onThemeChange ? (
            <div className="surface-panel-muted inline-flex items-center gap-1 rounded-full border border-border/70 p-1">
              <ThemeButton
                label="深色主题"
                active={theme === "dark"}
                onClick={() => onThemeChange("dark")}
                icon={<MoonStarIcon className="size-4" />}
              />
              <ThemeButton
                label="浅色主题"
                active={theme === "light"}
                onClick={() => onThemeChange("light")}
                icon={<SunIcon className="size-4" />}
              />
              <ThemeButton
                label="柔和主题"
                active={theme === "soft"}
                onClick={() => onThemeChange("soft")}
                icon={<SwatchBookIcon className="size-4" />}
              />
            </div>
          ) : null}

          <InfoHint
            label="帮助"
            mode="popover"
            triggerClassName="size-7 rounded-full"
            content={[
              "主入口已经压缩到首屏。",
              "1. 左上角抽屉：会话树、新建会话、使用帮助、免责声明和产品介绍。",
              "2. 主工作区标签：聊天、模型。",
              "3. 更多工具里收纳了会诊、复制、导出和系统分享。",
              "4. 如果某个面板内容较多，请直接在面板内部滚动，而不是整页下滑找内容。",
            ].join("\n")}
            align="end"
          />

          <div ref={moreToolsRef} className="relative">
            <IconActionButton
              label="更多工具"
              icon={<EllipsisIcon className="size-4" />}
              onClick={() => setMoreToolsOpen((current) => !current)}
              ariaExpanded={moreToolsOpen}
              ariaHaspopup
            />

            {!isCompactViewport && moreToolsOpen ? (
              <div className="surface-panel absolute right-0 top-[calc(100%+0.65rem)] z-30 flex w-64 flex-col gap-1 rounded-[22px] border border-border/70 p-2 shadow-[var(--surface-shadow-strong)]">
                <div className="px-2 py-1">
                  <p className="text-sm font-medium text-foreground">更多工具</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    把低频动作从顶栏移出，只在需要时展开。
                  </p>
                </div>
                {isChatView ? (
                  moreToolItems.map((item) => (
                    <MoreToolsAction
                      key={item.label}
                      label={item.label}
                      icon={item.icon}
                      disabled={item.disabled}
                      onClick={() => {
                        item.onClick?.()
                        setMoreToolsOpen(false)
                      }}
                    />
                  ))
                ) : (
                  <div className="rounded-[18px] border border-border/70 bg-background/65 px-3 py-3 text-xs leading-5 text-muted-foreground">
                    当前是知识页，没有会话级操作；如需导出、分享或会诊，请先回到聊天工作区。
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <Sheet open={isCompactViewport && moreToolsOpen} onOpenChange={setMoreToolsOpen}>
        <SheetContent side="bottom" className="border-border/70 bg-card p-0">
          <SheetHeader className="border-b border-border/70">
            <SheetTitle>更多工具</SheetTitle>
            <SheetDescription>低频动作统一收纳到这里，避免顶栏继续膨胀。</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-2 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            {isChatView ? (
              moreToolItems.map((item) => (
                <MoreToolsAction
                  key={item.label}
                  label={item.label}
                  icon={item.icon}
                  disabled={item.disabled}
                  onClick={() => {
                    item.onClick?.()
                    setMoreToolsOpen(false)
                  }}
                />
              ))
            ) : (
              <div className="rounded-[20px] border border-border/70 bg-background/65 px-4 py-3 text-sm leading-6 text-muted-foreground">
                当前是知识页，没有会话级工具；如需会诊、复制、导出或分享，请先切回聊天工作区。
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}

function ThemeButton({
  label,
  active,
  icon,
  onClick,
}: {
  label: string
  active: boolean
  icon: ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={[
        "group relative inline-flex size-9 items-center justify-center rounded-full transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      ].join(" ")}
      onClick={onClick}
    >
      {icon}
      <span className="pointer-events-none absolute left-1/2 top-[calc(100%+0.55rem)] z-20 hidden -translate-x-1/2 whitespace-nowrap rounded-full border border-border/70 bg-background/95 px-2.5 py-1 text-[11px] font-medium text-foreground shadow-[var(--surface-shadow-soft)] group-hover:block group-focus-visible:block">
        {label}
      </span>
    </button>
  )
}

function IconActionButton({
  label,
  icon,
  onClick,
  disabled = false,
  className,
  ariaExpanded = false,
  ariaHaspopup = false,
}: {
  label: string
  icon: ReactNode
  onClick: () => void
  disabled?: boolean
  className?: string
  ariaExpanded?: boolean
  ariaHaspopup?: boolean
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      aria-label={label}
      title={label}
      aria-expanded={ariaExpanded}
      aria-haspopup={ariaHaspopup ? "menu" : undefined}
      className={[
        "group relative rounded-full border-border/70 bg-background/70 text-foreground hover:bg-muted",
        className || "",
      ].join(" ")}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
      <span className="pointer-events-none absolute left-1/2 top-[calc(100%+0.55rem)] z-20 hidden -translate-x-1/2 whitespace-nowrap rounded-full border border-border/70 bg-background/95 px-2.5 py-1 text-[11px] font-medium text-foreground shadow-[var(--surface-shadow-soft)] group-hover:block group-focus-visible:block">
        {label}
      </span>
    </Button>
  )
}

function MoreToolsAction({
  label,
  icon,
  disabled,
  onClick,
}: {
  label: string
  icon: ReactNode
  disabled: boolean
  onClick: () => void
}) {
  return (
    <Button
      type="button"
      variant="outline"
      className="h-10 justify-start rounded-[18px] border-border/70 bg-background/70 px-3 text-foreground hover:bg-muted"
      disabled={disabled}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </Button>
  )
}
