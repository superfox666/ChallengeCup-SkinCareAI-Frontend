import { useMemo, useState } from "react"
import { CheckIcon, CopyIcon } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { Message } from "@/types/chat"

import { brandAiAvatarSrc } from "@/lib/brand-assets"
import { copyTextToClipboard } from "@/lib/share-utils"

interface MessageItemProps {
  message: Message
}

export function MessageItem({ message }: MessageItemProps) {
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

  const handleCopy = async () => {
    if (!assistantText) {
      return
    }

    const copiedSuccessfully = await copyTextToClipboard(assistantText)

    if (copiedSuccessfully) {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
      return
    }

    setCopied(false)
  }

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

      <div
        className={[
          "max-w-[min(76ch,92%)] rounded-[24px] border px-5 py-4 shadow-[var(--surface-shadow-soft)]",
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

            if (isAssistant) {
              return (
                <div
                  key={`${message.id}-${index}`}
                  className="text-sm leading-7 text-foreground [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_li]:ml-4 [&_li]:list-disc [&_ol]:ml-4 [&_ol]:list-decimal [&_p]:leading-7 [&_strong]:font-semibold [&_ul]:space-y-1"
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {part.text}
                  </ReactMarkdown>
                </div>
              )
            }

            return (
              <p key={`${message.id}-${index}`} className="text-sm leading-7 text-foreground">
                {part.text}
              </p>
            )
          })}

          <div className="flex flex-wrap items-center justify-between gap-3">
            {isAssistant && assistantText ? (
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
    </article>
  )
}
