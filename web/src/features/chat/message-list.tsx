import { useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"

import { ScrollArea } from "@/components/ui/scroll-area"
import type { Message } from "@/types/chat"

import { EmptyState } from "@/features/chat/empty-state"
import { MessageItem } from "@/features/chat/message-item"
import { TypingIndicator } from "@/features/chat/typing-indicator"

interface MessageListProps {
  messages: Message[]
  busy: boolean
  onPromptSelect: (prompt: string) => void
}

export function MessageList({ messages, busy, onPromptSelect }: MessageListProps) {
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [busy, messages])

  return (
    <div className="app-surface app-panel-surface min-h-0 flex-1 overflow-hidden rounded-[30px] border border-white/8 bg-[linear-gradient(180deg,rgba(14,25,47,0.92),rgba(11,20,37,0.82))]">
      <ScrollArea className="h-full">
        <div className="flex min-h-full flex-col gap-5 p-5 lg:p-6">
          {messages.length === 0 ? (
            <EmptyState onPromptSelect={onPromptSelect} />
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
          <div ref={endRef} />
        </div>
      </ScrollArea>
    </div>
  )
}
