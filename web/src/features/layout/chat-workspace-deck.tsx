import type { ReactNode } from "react"
import {
  MessageSquareTextIcon,
  SlidersHorizontalIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

export type ChatWorkspaceTabId = "chat" | "models"

interface ChatWorkspaceDeckProps {
  activeTab: ChatWorkspaceTabId
  onTabChange: (tab: ChatWorkspaceTabId) => void
  currentModelName?: string
  panels: Record<ChatWorkspaceTabId, ReactNode>
}

const workspaceTabs: Array<{
  id: ChatWorkspaceTabId
  label: string
  icon: typeof MessageSquareTextIcon
}> = [
  {
    id: "chat",
    label: "聊天",
    icon: MessageSquareTextIcon,
  },
  {
    id: "models",
    label: "模型",
    icon: SlidersHorizontalIcon,
  },
]

export function ChatWorkspaceDeck({
  activeTab,
  onTabChange,
  currentModelName,
  panels,
}: ChatWorkspaceDeckProps) {
  return (
    <section className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-hidden">
      <div className="surface-panel-muted app-surface flex items-center justify-between gap-3 rounded-[22px] border border-border/70 px-3 py-2 shadow-[var(--surface-shadow-soft)]">
        <div className="flex items-center gap-1.5">
          {workspaceTabs.map((tab) => {
            const Icon = tab.icon
            const selected = activeTab === tab.id

            return (
              <button
                key={tab.id}
                type="button"
                aria-label={`切换到${tab.label}`}
                title={tab.label}
                className={cn(
                  "group relative inline-flex h-9 items-center justify-center gap-2 rounded-full border px-3.5 text-sm transition-colors",
                  selected
                    ? "border-primary/35 bg-primary/12 text-primary shadow-[0_14px_28px_rgba(38,198,190,0.14)]"
                    : "border-border/70 bg-background/65 text-muted-foreground hover:border-primary/20 hover:bg-muted/55 hover:text-foreground"
                )}
                onClick={() => onTabChange(tab.id)}
              >
                <Icon className="size-4" />
                <span>{tab.label}</span>
                <span className="pointer-events-none absolute left-1/2 top-[calc(100%+0.55rem)] z-20 hidden -translate-x-1/2 whitespace-nowrap rounded-full border border-border/70 bg-background/95 px-2.5 py-1 text-[11px] font-medium text-foreground shadow-[var(--surface-shadow-soft)] group-hover:block group-focus-visible:block">
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          {currentModelName ? (
            <span className="rounded-full border border-border/70 bg-background/70 px-2.5 py-1">
              <span translate="no">{currentModelName}</span>
            </span>
          ) : null}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        <div className="surface-panel app-surface flex h-full min-h-0 flex-col overflow-hidden rounded-[30px] border border-border/70 p-3 shadow-[var(--surface-shadow-soft)] lg:p-4">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{panels[activeTab]}</div>
        </div>
      </div>
    </section>
  )
}
