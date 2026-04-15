import { useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"

import { ScrollArea } from "@/components/ui/scroll-area"
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
}: MessageListProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const endRef = useRef<HTMLDivElement | null>(null)
  const isEmptyConversation = messages.length === 0
  const isCompactConversation = messages.length > 0 && messages.length <= 3

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
      className={[
        "surface-panel app-surface overflow-hidden rounded-[30px] border border-border/70 shadow-[var(--surface-shadow-soft)]",
        isEmptyConversation
          ? "min-h-[240px] max-h-[min(34svh,360px)] lg:min-h-[260px] lg:max-h-[min(38svh,420px)]"
          : isCompactConversation
          ? "min-h-[220px] max-h-[min(34svh,400px)] lg:min-h-[240px] lg:max-h-[min(38svh,440px)]"
          : "min-h-[380px] max-h-[min(64svh,760px)] lg:min-h-[420px]",
      ].join(" ")}
    >
      <ScrollArea className="h-full">
        <div className="flex min-h-full flex-col gap-4 p-4 lg:gap-5 lg:p-5">
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
                  <MessageItem message={message} />
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
            <div className="surface-panel-muted rounded-[24px] border border-border/70 p-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-foreground">继续追问建议</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    当前信息还不多，直接补一句重点就能让这一轮更像完整问诊。
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
                    className="surface-panel flex min-h-0 flex-1 basis-[220px] items-start rounded-[20px] border border-border/70 px-3.5 py-3 text-left text-sm leading-6 text-foreground transition-colors hover:border-primary/20 hover:bg-muted/60"
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
