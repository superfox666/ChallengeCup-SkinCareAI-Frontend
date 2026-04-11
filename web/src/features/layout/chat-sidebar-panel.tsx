import type { Conversation, ModelDefinition } from "@/types/chat"

import { BrandBlock } from "@/features/sidebar/brand-block"
import { ConversationList } from "@/features/sidebar/conversation-list"
import { NewConversationButton } from "@/features/sidebar/new-conversation-button"

interface ChatSidebarPanelProps {
  conversations: Conversation[]
  modelsById: Record<string, ModelDefinition>
  activeConversationId: string | null
  messagesCountById: Record<string, number>
  onSelectConversation: (conversationId: string) => void
  onCreateConversation: () => void
  onRenameConversation: (conversationId: string, nextTitle: string) => void
  onDeleteConversation: (conversationId: string) => void
  busy: boolean
}

export function ChatSidebarPanel({
  conversations,
  modelsById,
  activeConversationId,
  messagesCountById,
  onSelectConversation,
  onCreateConversation,
  onRenameConversation,
  onDeleteConversation,
  busy,
}: ChatSidebarPanelProps) {
  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col gap-5">
      <BrandBlock />
      <NewConversationButton onCreate={onCreateConversation} />
      <ConversationList
        conversations={conversations}
        modelsById={modelsById}
        activeConversationId={activeConversationId}
        messagesCountById={messagesCountById}
        onSelect={onSelectConversation}
        onRename={onRenameConversation}
        onDelete={onDeleteConversation}
        busy={busy}
      />
    </div>
  )
}
