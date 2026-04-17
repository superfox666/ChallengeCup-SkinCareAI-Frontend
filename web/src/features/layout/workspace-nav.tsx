import { BookOpenTextIcon, MessageSquareTextIcon } from "lucide-react"
import { NavLink } from "react-router-dom"

import { cn } from "@/lib/utils"

const navItems = [
  {
    to: "/chat",
    label: "聊天工作区",
    shortLabel: "聊天",
    icon: MessageSquareTextIcon,
  },
  {
    to: "/knowledge",
    label: "知识页",
    shortLabel: "知识",
    icon: BookOpenTextIcon,
  },
] as const

export function WorkspaceNav() {
  return (
    <nav
      aria-label="主工作区切换"
      className="surface-panel-muted inline-flex items-center gap-1 rounded-full border border-border/70 p-1"
    >
      {navItems.map((item) => {
        const Icon = item.icon

        return (
          <NavLink
            key={item.to}
            to={item.to}
            aria-label={item.label}
            title={item.label}
            className={({ isActive }) =>
              cn(
                "group relative inline-flex h-9 items-center justify-center gap-2 rounded-full px-3 text-sm font-medium text-muted-foreground transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-[0_14px_28px_rgba(38,198,190,0.22)]"
                  : "hover:bg-muted hover:text-foreground"
              )
            }
          >
            <Icon className="size-4" />
            <span className="inline sm:hidden">{item.shortLabel}</span>
            <span className="hidden sm:inline">{item.label}</span>
            <span className="pointer-events-none absolute left-1/2 top-[calc(100%+0.55rem)] z-20 hidden -translate-x-1/2 whitespace-nowrap rounded-full border border-border/70 bg-background/95 px-2.5 py-1 text-[11px] font-medium text-foreground shadow-[var(--surface-shadow-soft)] group-hover:block group-focus-visible:block">
              {item.label}
            </span>
          </NavLink>
        )
      })}
    </nav>
  )
}
