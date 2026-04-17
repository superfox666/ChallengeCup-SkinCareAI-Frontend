import { runtimeBuildId } from "@/lib/runtime-instance"

interface DevRuntimeBadgeProps {
  currentView: "chat" | "knowledge"
  modelCount: number
  knowledgeCount: number
}

export function DevRuntimeBadge({
  currentView,
  modelCount,
  knowledgeCount,
}: DevRuntimeBadgeProps) {
  if (!import.meta.env.DEV) {
    return null
  }

  const viewLabel = currentView === "knowledge" ? "知识页" : "聊天工作区"
  const markerLabel =
    currentView === "knowledge"
      ? `全部内容 ${knowledgeCount}`
      : `模型 ${modelCount}`

  return (
    <div className="pointer-events-none fixed bottom-3 right-3 z-[70] flex max-w-[calc(100vw-1.5rem)] flex-wrap items-center gap-1.5 rounded-full border border-border/70 bg-background/88 px-3 py-1.5 text-[11px] font-medium text-foreground shadow-[var(--surface-shadow-soft)] backdrop-blur-md">
      <span className="text-primary/90">DEV</span>
      <span>{viewLabel}</span>
      <span className="text-muted-foreground">{markerLabel}</span>
      <span className="font-mono text-[10px] text-muted-foreground" translate="no">
        {runtimeBuildId}
      </span>
    </div>
  )
}
