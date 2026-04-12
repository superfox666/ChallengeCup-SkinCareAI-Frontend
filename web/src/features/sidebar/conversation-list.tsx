import { MessageSquareTextIcon } from "lucide-react"

import { ScrollArea } from "@/components/ui/scroll-area"
import type { Conversation, ModelDefinition } from "@/types/chat"

import { ConversationListItem } from "@/features/sidebar/conversation-list-item"

interface ConversationListProps {
  conversations: Conversation[]
  modelsById: Record<string, ModelDefinition>
  activeConversationId: string | null
  messagesCountById: Record<string, number>
  onSelect: (conversationId: string) => void
  onRename: (conversationId: string, nextTitle: string) => void
  onDelete: (conversationId: string) => void
  busy: boolean
}

export function ConversationList({
  conversations,
  modelsById,
  activeConversationId,
  messagesCountById,
  onSelect,
  onRename,
  onDelete,
  busy,
}: ConversationListProps) {
  return (
    <div className="app-surface app-panel-surface flex min-h-0 flex-1 flex-col gap-4 overflow-hidden rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(14,26,49,0.9),rgba(10,18,35,0.82))] p-3">
      <div className="flex items-center justify-between gap-3 px-2 pt-1.5">
        <div className="flex items-center gap-2 text-sm font-medium text-white">
          <MessageSquareTextIcon className="size-4 text-primary" />
          会话列表
        </div>
        <span className="text-xs text-slate-400">{conversations.length} 个</span>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-2 pr-2">
          {conversations.map((conversation) => {
            const model = modelsById[conversation.modelId]

            if (!model) {
              return null
            }

            return (
              <ConversationListItem
                key={conversation.id}
                conversation={conversation}
                model={model}
                messageCount={messagesCountById[conversation.id] ?? 0}
                active={conversation.id === activeConversationId}
                onSelect={() => onSelect(conversation.id)}
                onRename={(nextTitle) => onRename(conversation.id, nextTitle)}
                onDelete={() => onDelete(conversation.id)}
                busy={busy}
              />
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
