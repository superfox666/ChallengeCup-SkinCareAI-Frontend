import { useState } from "react"
import { CheckIcon, PencilIcon, Trash2Icon, XIcon } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Conversation, ModelDefinition } from "@/types/chat"

interface ConversationListItemProps {
  conversation: Conversation
  model: ModelDefinition
  messageCount: number
  active: boolean
  onSelect: () => void
  onRename: (nextTitle: string) => void
  onDelete: () => void
  busy: boolean
}

function formatRelativeLabel(conversation: Conversation) {
  return conversation.sessionType === "vision" ? "图片问诊" : "文本问诊"
}

export function ConversationListItem({
  conversation,
  model,
  messageCount,
  active,
  onSelect,
  onRename,
  onDelete,
  busy,
}: ConversationListItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draftTitle, setDraftTitle] = useState(conversation.title)

  const commitRename = () => {
    const trimmedTitle = draftTitle.trim()

    if (!trimmedTitle) {
      setDraftTitle(conversation.title)
      setIsEditing(false)
      return
    }

    onRename(trimmedTitle)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="rounded-[22px] border border-primary/40 bg-primary/10 px-4 py-3">
        <div className="flex flex-col gap-3">
          <Input
            value={draftTitle}
            onChange={(event) => setDraftTitle(event.target.value)}
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                commitRename()
              }

              if (event.key === "Escape") {
                setDraftTitle(conversation.title)
                setIsEditing(false)
              }
            }}
            className="h-10 rounded-2xl border-border/70 bg-background/80 text-foreground"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => {
                setDraftTitle(conversation.title)
                setIsEditing(false)
              }}
            >
              <XIcon />
            </Button>
            <Button type="button" size="icon-sm" onClick={commitRename}>
              <CheckIcon />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={[
        "flex w-full flex-col gap-2 rounded-[22px] border px-4 py-3 text-left transition-all",
        active
          ? "border-primary/40 bg-primary/10 shadow-[0_18px_36px_rgba(38,198,190,0.14)]"
          : "border-border/70 bg-background/60 hover:border-primary/20 hover:bg-muted/60",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onSelect}
          className="flex min-w-0 flex-1 appearance-none items-center gap-3 bg-transparent text-left"
        >
          <span className="truncate text-sm font-medium text-foreground">
            {conversation.title}
          </span>
          <span
            className={[
              "size-2 rounded-full",
              conversation.status === "responding"
                ? "bg-primary"
                : conversation.status === "error"
                  ? "bg-amber-400"
                  : "bg-muted-foreground/45",
            ].join(" ")}
          />
        </button>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="重命名会话"
            className="text-muted-foreground hover:bg-muted hover:text-foreground"
            disabled={busy}
            onClick={(event) => {
              event.stopPropagation()
              setDraftTitle(conversation.title)
              setIsEditing(true)
            }}
          >
            <PencilIcon />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="删除会话"
                className="text-muted-foreground hover:bg-muted hover:text-foreground"
                disabled={busy}
                onClick={(event) => event.stopPropagation()}
              >
                <Trash2Icon />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-border/70 bg-card text-foreground">
              <AlertDialogHeader>
                <AlertDialogTitle>删除会话</AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground">
                  删除后将无法恢复当前会话记录。若这是最后一个会话，系统会自动创建新的空会话。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-border/70 bg-background/70 text-foreground hover:bg-muted hover:text-foreground">
                  取消
                </AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={(event) => {
                    event.stopPropagation()
                    onDelete()
                  }}
                >
                  删除
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <button
          type="button"
          onClick={onSelect}
          className="flex min-w-0 flex-1 appearance-none items-center justify-between gap-3 bg-transparent text-left"
        >
          <span className="truncate">{model.name}</span>
          <span>{formatRelativeLabel(conversation)}</span>
        </button>
      </div>

      <div className="flex items-center justify-between gap-3 text-[0.72rem] text-muted-foreground">
        <button
          type="button"
          onClick={onSelect}
          className="flex w-full appearance-none items-center justify-between gap-3 bg-transparent text-left"
        >
          <span>{messageCount} 条消息</span>
          <span>
            {new Date(conversation.updatedAt).toLocaleTimeString("zh-CN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </button>
      </div>
    </div>
  )
}
