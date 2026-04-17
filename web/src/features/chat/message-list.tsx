import { useEffect, useMemo, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Maximize2Icon, Minimize2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { Message, ModelDefinition } from "@/types/chat"

import { EmptyState } from "@/features/chat/empty-state"
import { MessageItem } from "@/features/chat/message-item"
import { TypingIndicator } from "@/features/chat/typing-indicator"

interface MessageListProps {
  conversationId?: string | null
  messages: Message[]
  busy: boolean
  currentModel: ModelDefinition
  defaultGeneralModel?: ModelDefinition | null
  onPromptSelect: (prompt: string) => void
  onExportAssistantTurn?: (assistantMessage: Message, pairedQuestion: Message | null) => void
  onToggleFullscreen?: () => void
  isFullscreen?: boolean
  fillHeight?: boolean
  className?: string
}

const followUpPrompts = [
  "帮我把当前情况整理成 3 条最重要的护理优先级。",
  "如果接下来 3 天都没有改善，我该重点观察哪些变化？",
  "你还需要我补充哪些信息，才能把建议说得更稳一些？",
]

export function MessageList({
  conversationId,
  messages,
  busy,
  currentModel,
  defaultGeneralModel,
  onPromptSelect,
  onExportAssistantTurn,
  onToggleFullscreen,
  isFullscreen = false,
  fillHeight = false,
  className,
}: MessageListProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const endRef = useRef<HTMLDivElement | null>(null)
  const isEmptyConversation = messages.length === 0
  const isCompactConversation = messages.length > 0 && messages.length <= 3
  const pairedQuestionByAssistantId = useMemo(() => {
    let latestUserMessage: Message | null = null
    const mapping = new Map<string, Message | null>()

    for (const message of messages) {
      if (message.role === "user") {
        latestUserMessage = message
        continue
      }

      if (message.role === "assistant") {
        mapping.set(message.id, latestUserMessage)
      }
    }

    return mapping
  }, [messages])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [busy, messages])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" })

    const viewport = containerRef.current?.querySelector("[data-radix-scroll-area-viewport]")

    if (viewport instanceof HTMLElement) {
      viewport.scrollTop = 0
    }
  }, [conversationId])

  return (
    <div
      ref={containerRef}
      className={cn(
        "surface-panel app-surface overflow-hidden rounded-[30px] border border-border/70 shadow-[var(--surface-shadow-soft)]",
        fillHeight
          ? "flex min-h-0 flex-1 flex-col"
          : isEmptyConversation
            ? "min-h-[220px] max-h-[min(32dvh,340px)] lg:min-h-[240px] lg:max-h-[min(34dvh,380px)]"
            : isCompactConversation
              ? "min-h-[220px] max-h-[min(34dvh,380px)] lg:min-h-[240px] lg:max-h-[min(38dvh,420px)]"
              : "min-h-[340px] max-h-[min(58dvh,680px)] lg:min-h-[360px] lg:max-h-[min(60dvh,720px)]",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border/70 px-4 py-3 lg:px-5">
        <div className="min-w-0">
          <p className="text-[0.72rem] font-medium uppercase tracking-[0.26em] text-primary/80">
            聊天记录
          </p>
          <p className="mt-1 truncate text-sm text-muted-foreground">
            <span translate="no">{currentModel.displayName || currentModel.name}</span>
            {defaultGeneralModel && defaultGeneralModel.id !== currentModel.id
              ? ` · 默认入口 ${defaultGeneralModel.displayName || defaultGeneralModel.name}`
              : ""}
          </p>
        </div>

        {onToggleFullscreen ? (
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label={isFullscreen ? "退出全屏聊天" : "进入全屏聊天"}
            title={isFullscreen ? "退出全屏聊天" : "进入全屏聊天"}
            className="rounded-full border-border/70 bg-background/70 text-foreground hover:bg-muted"
            onClick={onToggleFullscreen}
          >
            {isFullscreen ? <Minimize2Icon /> : <Maximize2Icon />}
          </Button>
        ) : null}
      </div>

      <ScrollArea className={cn("h-full overscroll-contain", fillHeight ? "min-h-0 flex-1" : "")}>
        <div className="flex min-h-full flex-col gap-3.5 px-4 py-4 lg:gap-4 lg:px-5 lg:py-5">
          {messages.length === 0 ? (
            <EmptyState
              currentModel={currentModel}
              defaultGeneralModel={defaultGeneralModel}
              onPromptSelect={onPromptSelect}
            />
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                >
                  <MessageItem
                    message={message}
                    pairedQuestion={message.role === "assistant" ? pairedQuestionByAssistantId.get(message.id) ?? null : null}
                    onExportPair={message.role === "assistant" ? onExportAssistantTurn : undefined}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          {busy ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <TypingIndicator />
            </motion.div>
          ) : null}
          {!busy && messages.length > 0 && messages.length <= 3 ? (
            <div className="surface-panel-muted rounded-[22px] border border-border/70 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary/75">继续追问</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    当前信息还不多，补一两句重点通常就能让建议更完整。
                  </p>
                </div>
                <div className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {currentModel.displayName || currentModel.name}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {followUpPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    className="surface-panel rounded-full border border-border/70 px-3.5 py-2 text-left text-[13px] leading-5 text-foreground transition-colors hover:border-primary/20 hover:bg-muted/60"
                    onClick={() => onPromptSelect(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          <div ref={endRef} />
        </div>
      </ScrollArea>
    </div>
  )
}
