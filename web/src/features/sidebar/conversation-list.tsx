import { useMemo, useState } from "react"
import { Clock3Icon, MessageSquareTextIcon, SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  onUpdateTags: (conversationId: string, nextTags: string[]) => void
  onArchive: (conversationId: string) => void
  onRestore: (conversationId: string) => void
  onDelete: (conversationId: string) => void
  busyConversationId?: string | null
  scrollMode?: "self" | "parent"
}

const groupOrder = [
  { key: "today", label: "今天" },
  { key: "yesterday", label: "昨天" },
  { key: "week", label: "近 7 天" },
  { key: "earlier", label: "更早" },
] as const

function getConversationGroupKey(updatedAt: string) {
  const targetDate = new Date(updatedAt)

  if (Number.isNaN(targetDate.getTime())) {
    return "earlier"
  }

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterdayStart = new Date(todayStart)
  yesterdayStart.setDate(yesterdayStart.getDate() - 1)
  const weekStart = new Date(todayStart)
  weekStart.setDate(weekStart.getDate() - 6)

  if (targetDate >= todayStart) {
    return "today"
  }

  if (targetDate >= yesterdayStart) {
    return "yesterday"
  }

  if (targetDate >= weekStart) {
    return "week"
  }

  return "earlier"
}

function getConversationTimelineAt(conversation: Conversation) {
  return conversation.archived ? conversation.archivedAt || conversation.updatedAt : conversation.updatedAt
}

export function ConversationList({
  conversations,
  modelsById,
  activeConversationId,
  messagesCountById,
  onSelect,
  onRename,
  onUpdateTags,
  onArchive,
  onRestore,
  onDelete,
  busyConversationId = null,
  scrollMode = "self",
}: ConversationListProps) {
  const [query, setQuery] = useState("")
  const [scope, setScope] = useState<"active" | "archived">("active")

  const scopedConversations = useMemo(
    () =>
      conversations.filter((conversation) =>
        scope === "archived" ? Boolean(conversation.archived) : !conversation.archived
      ),
    [conversations, scope]
  )

  const filteredConversations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return scopedConversations
    }

    return scopedConversations.filter((conversation) => {
      const model = modelsById[conversation.modelId]
      const searchText = [
        conversation.title,
        model?.displayName,
        model?.name,
        conversation.sessionType === "vision" ? "图片问诊" : "文本问诊",
        ...(conversation.tags ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()

      return searchText.includes(normalizedQuery)
    })
  }, [modelsById, query, scopedConversations])

  const groupedConversations = useMemo(
    () =>
      groupOrder
        .map((group) => ({
          ...group,
          items: filteredConversations.filter(
            (conversation) => getConversationGroupKey(getConversationTimelineAt(conversation)) === group.key
          ),
        }))
        .filter((group) => group.items.length > 0),
    [filteredConversations]
  )

  const listContent = (
    <div className="flex flex-col gap-3 pb-4 pr-2">
      {groupedConversations.length === 0 ? (
        <div className="surface-panel-muted mx-2 rounded-[22px] border border-border/70 px-4 py-4 text-sm leading-7 text-muted-foreground">
          {query.trim()
            ? `没有找到和 “${query.trim()}” 相关的${scope === "archived" ? "归档会话" : "会话"}。`
            : scope === "archived"
              ? "当前还没有归档会话。"
              : "当前还没有进行中的会话，可以直接新建一个更清晰的分支。"}
        </div>
      ) : (
        groupedConversations.map((group) => (
          <section key={group.key} className="space-y-2">
            <div className="flex items-center gap-2 px-2">
              <Clock3Icon className="size-3.5 text-primary" />
              <span className="text-xs font-medium uppercase tracking-[0.24em] text-primary/75">
                {group.label}
              </span>
              <span className="text-xs text-muted-foreground">{group.items.length}</span>
            </div>

            <div className="flex flex-col gap-2">
              {group.items.map((conversation) => {
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
                    onUpdateTags={(nextTags) => onUpdateTags(conversation.id, nextTags)}
                    onArchive={() => onArchive(conversation.id)}
                    onRestore={() => onRestore(conversation.id)}
                    onDelete={() => onDelete(conversation.id)}
                    busy={busyConversationId === conversation.id}
                  />
                )
              })}
            </div>
          </section>
        ))
      )}
    </div>
  )

  return (
    <div
      className={[
        "surface-panel app-surface flex min-h-0 flex-col gap-2.5 rounded-[26px] border border-border/70 p-2.5 shadow-[var(--surface-shadow-soft)]",
        scrollMode === "self" ? "flex-1 overflow-hidden" : "overflow-visible",
      ].join(" ")}
    >
      <div className="space-y-2.5 px-2 pt-1">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <MessageSquareTextIcon className="size-4 text-primary" />
            会话列表
          </div>
          <span className="text-xs text-muted-foreground">{conversations.length} 个</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={scope === "active" ? "default" : "outline"}
            size="sm"
            className="h-8 rounded-full px-3"
            onClick={() => setScope("active")}
          >
            进行中
            <span className="ml-1 text-[11px] opacity-80">
              {conversations.filter((conversation) => !conversation.archived).length}
            </span>
          </Button>
          <Button
            type="button"
            variant={scope === "archived" ? "default" : "outline"}
            size="sm"
            className="h-8 rounded-full px-3"
            onClick={() => setScope("archived")}
          >
            已归档
            <span className="ml-1 text-[11px] opacity-80">
              {conversations.filter((conversation) => conversation.archived).length}
            </span>
          </Button>
        </div>

        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索标题、模型或问诊类型"
            className="h-10 rounded-2xl border-border/70 bg-background/70 pl-9 text-foreground"
          />
        </div>
      </div>

      {scrollMode === "self" ? (
        <ScrollArea className="min-h-0 flex-1 overscroll-contain">
          {listContent}
        </ScrollArea>
      ) : (
        listContent
      )}
    </div>
  )
}
