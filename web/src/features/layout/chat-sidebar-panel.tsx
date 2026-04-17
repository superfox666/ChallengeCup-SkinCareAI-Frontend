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
  onUpdateConversationTags: (conversationId: string, nextTags: string[]) => void
  onArchiveConversation: (conversationId: string) => void
  onRestoreConversation: (conversationId: string) => void
  onDeleteConversation: (conversationId: string) => void
  busyConversationId?: string | null
}

export function ChatSidebarPanel({
  conversations,
  modelsById,
  activeConversationId,
  messagesCountById,
  onSelectConversation,
  onCreateConversation,
  onRenameConversation,
  onUpdateConversationTags,
  onArchiveConversation,
  onRestoreConversation,
  onDeleteConversation,
  busyConversationId = null,
}: ChatSidebarPanelProps) {
  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col gap-4 overflow-hidden pb-3">
      <BrandBlock />
      <NewConversationButton onCreate={onCreateConversation} />
      <ConversationList
        conversations={conversations}
        modelsById={modelsById}
        activeConversationId={activeConversationId}
        messagesCountById={messagesCountById}
        onSelect={onSelectConversation}
        onRename={onRenameConversation}
        onUpdateTags={onUpdateConversationTags}
        onArchive={onArchiveConversation}
        onRestore={onRestoreConversation}
        onDelete={onDeleteConversation}
        busyConversationId={busyConversationId}
      />
    </div>
  )
}
