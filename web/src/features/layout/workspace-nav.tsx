import { NavLink } from "react-router-dom"

import { cn } from "@/lib/utils"

export function WorkspaceNav() {
  return (
    <nav className="inline-flex rounded-2xl border border-white/8 bg-white/5 p-1.5">
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
                : "text-slate-300 hover:bg-white/8 hover:text-white"
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
