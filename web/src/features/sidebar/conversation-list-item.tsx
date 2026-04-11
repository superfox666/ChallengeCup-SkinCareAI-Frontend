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
      <div className="flex flex-col gap-3 rounded-[20px] border border-primary/45 bg-primary/12 px-4 py-3">
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
          className="h-10 rounded-2xl border-white/12 bg-white/8 text-white"
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
    )
  }

  return (
    <div
      className={[
        "flex w-full flex-col gap-2 rounded-[20px] border px-4 py-3 text-left transition-all",
        active
          ? "border-primary/45 bg-primary/12 shadow-[0_18px_36px_rgba(8,21,43,0.26)]"
          : "border-white/8 bg-white/4 hover:border-white/16 hover:bg-white/7",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onSelect}
          className="flex min-w-0 flex-1 appearance-none items-center gap-3 bg-transparent text-left"
        >
          <span className="truncate text-sm font-medium text-white">
            {conversation.title}
          </span>
          <span
            className={[
              "size-2 rounded-full",
              conversation.status === "responding"
                ? "bg-primary"
                : conversation.status === "error"
                  ? "bg-amber-400"
                  : "bg-slate-500",
            ].join(" ")}
          />
        </button>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-slate-300 hover:bg-white/8 hover:text-white"
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
                className="text-slate-300 hover:bg-white/8 hover:text-white"
                disabled={busy}
                onClick={(event) => event.stopPropagation()}
              >
                <Trash2Icon />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-white/10 bg-[#10203d] text-white">
              <AlertDialogHeader>
                <AlertDialogTitle>删除会话</AlertDialogTitle>
                <AlertDialogDescription className="text-slate-300">
                  删除后将无法恢复当前会话记录。若这是最后一个会话，系统会自动创建新的空会话。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-white/12 bg-white/6 text-slate-100 hover:bg-white/8 hover:text-white">
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
      <div className="flex items-center justify-between gap-3 text-xs text-slate-400">
        <button
          type="button"
          onClick={onSelect}
          className="flex min-w-0 flex-1 appearance-none items-center justify-between gap-3 bg-transparent text-left"
        >
          <span className="truncate">{model.name}</span>
          <span>{formatRelativeLabel(conversation)}</span>
        </button>
      </div>
      <div className="flex items-center justify-between gap-3 text-[0.72rem] text-slate-500">
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
