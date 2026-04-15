import { NavLink } from "react-router-dom"

import { cn } from "@/lib/utils"

export function WorkspaceNav() {
  return (
    <nav className="surface-panel-muted inline-flex rounded-2xl border border-border/70 p-1.5">
      {[
        { to: "/chat", label: "智能问诊" },
        { to: "/knowledge", label: "皮肤科普" },
      ].map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              "rounded-xl px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
