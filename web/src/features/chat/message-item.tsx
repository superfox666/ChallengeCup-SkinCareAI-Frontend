import { useMemo, useState } from "react"
import { CheckIcon, CopyIcon, DownloadIcon } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { Message } from "@/types/chat"

import { brandAiAvatarSrc } from "@/lib/brand-assets"
import { copyTextToClipboard } from "@/lib/share-utils"

interface MessageItemProps {
  message: Message
  pairedQuestion?: Message | null
  onExportPair?: (assistantMessage: Message, pairedQuestion: Message | null) => void
}

const EMPTY_ASSISTANT_MESSAGE =
  "本轮响应为空，可能是流式收口异常或上游返回了空内容。请重试一次，或切换到其他模型继续。"

function looksUnreadable(text: string) {
  const compact = text.replace(/\s+/g, "")

  if (!compact) {
    return false
  }

  const suspiciousCount = (compact.match(/[?？�]/g) || []).length
  const visibleCount = compact.replace(/[?？�.,，。!！:：;；'"`~\-_/\\()[\]{}<>《》【】]/g, "").length

  return suspiciousCount >= 6 && visibleCount <= Math.ceil(compact.length * 0.45)
}

export function MessageItem({
  message,
  pairedQuestion = null,
  onExportPair,
}: MessageItemProps) {
  const isAssistant = message.role === "assistant"
  const [copied, setCopied] = useState(false)
  const assistantText = useMemo(
    () =>
      message.parts.reduce((fullText, part) => {
        if (part.type !== "text") {
          return fullText
        }

        return [...fullText, part.text]
      }, [] as string[]).join("\n\n").trim(),
    [message.parts]
  )
  const assistantDisplayText = useMemo(() => {
    if (!isAssistant) {
      return assistantText
    }

    if (!assistantText.trim()) {
      return EMPTY_ASSISTANT_MESSAGE
    }

    if (looksUnreadable(assistantText)) {
      return [
        "系统检测到本轮返回内容疑似乱码或不可读，建议重试一次，或切换到其他模型继续。",
        "",
        "原始返回：",
        assistantText,
      ].join("\n")
    }

    return assistantText
  }, [assistantText, isAssistant])

  const handleCopy = async () => {
    if (!assistantDisplayText) {
      return
    }

    const copiedSuccessfully = await copyTextToClipboard(assistantDisplayText)

    if (copiedSuccessfully) {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
      return
    }

    setCopied(false)
  }

  const bubble = (
    <div
      className={[
        "rounded-[24px] border px-5 py-4 shadow-[var(--surface-shadow-soft)]",
        isAssistant
          ? "surface-message-assistant border-border/70 text-foreground"
          : "surface-message-user border-primary/30 text-foreground",
      ].join(" ")}
    >
      <div className="flex flex-col gap-3">
        {message.parts.map((part, index) => {
          if (part.type === "image") {
            return (
              <div
                key={`${message.id}-${index}`}
                className="overflow-hidden rounded-[20px] border border-border/70 bg-background/70"
              >
                {part.image.previewUrl ? (
                  <img
                    src={part.image.previewUrl}
                    alt={part.image.name}
                    className="max-h-64 w-full object-cover"
                  />
                ) : (
                  <div className="flex min-h-36 flex-col items-center justify-center gap-2 px-4 py-6 text-center text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">{part.image.name}</p>
                    <p>{part.image.persistenceNote ?? "图片预览不可用，请重新上传原图。"}</p>
                  </div>
                )}
              </div>
            )
          }

          if (isAssistant || part.type !== "text") {
            return null
          }

          return (
            <p key={`${message.id}-${index}`} className="text-sm leading-7 text-foreground">
              {part.text}
            </p>
          )
        })}

        {isAssistant ? (
          <div className="text-sm leading-7 text-foreground [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_li]:ml-4 [&_li]:list-disc [&_ol]:ml-4 [&_ol]:list-decimal [&_p]:leading-7 [&_strong]:font-semibold [&_ul]:space-y-1">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{assistantDisplayText}</ReactMarkdown>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3">
          {isAssistant && assistantDisplayText ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 rounded-full border-border/70 bg-background/70 px-3 text-foreground hover:bg-muted"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <CheckIcon data-icon="inline-start" className="text-primary" />
                  已复制
                </>
              ) : (
                <>
                  <CopyIcon data-icon="inline-start" />
                  复制回答
                </>
              )}
            </Button>
          ) : (
            <span />
          )}
          <span className="text-xs text-muted-foreground">
            {message.state === "streaming"
              ? "生成中…"
              : new Date(message.createdAt).toLocaleTimeString("zh-CN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
          </span>
        </div>
      </div>
    </div>
  )

  return (
    <article
      className={[
        "flex w-full gap-3",
        isAssistant ? "justify-start" : "justify-end",
      ].join(" ")}
    >
      {isAssistant ? (
        <Avatar size="lg" className="mt-1 border border-primary/20 bg-primary/8">
          <AvatarImage src={brandAiAvatarSrc} alt="SkinCareAI" className="object-contain p-1" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      ) : null}

      {isAssistant ? (
        <div className="flex max-w-[min(82ch,94%)] items-start gap-2">
          <div className="min-w-0 flex-1">{bubble}</div>
          {onExportPair ? (
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label="导出当前问答 Markdown"
              title="导出当前问答 Markdown"
              className="mt-2 rounded-full border-border/70 bg-background/70 text-foreground hover:bg-muted"
              onClick={() => onExportPair(message, pairedQuestion)}
            >
              <DownloadIcon />
            </Button>
          ) : null}
        </div>
      ) : (
        <div className="max-w-[min(76ch,92%)]">{bubble}</div>
      )}
    </article>
  )
}
