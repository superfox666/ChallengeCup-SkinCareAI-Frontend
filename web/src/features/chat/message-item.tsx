import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Message } from "@/types/chat"

import aiAvatar from "@/assets/brand/ai-avatar.png"

interface MessageItemProps {
  message: Message
}

export function MessageItem({ message }: MessageItemProps) {
  const isAssistant = message.role === "assistant"

  return (
    <article
      className={[
        "flex w-full gap-3",
        isAssistant ? "justify-start" : "justify-end",
      ].join(" ")}
    >
      {isAssistant ? (
        <Avatar size="lg" className="mt-1 border border-primary/20 bg-primary/8">
          <AvatarImage src={aiAvatar} alt="SkinCareAI" className="object-contain p-1" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      ) : null}
      <div
        className={[
          "max-w-3xl rounded-[24px] border px-5 py-4 shadow-[0_18px_40px_rgba(0,0,0,0.18)]",
          isAssistant
            ? "border-white/10 bg-white/6 text-slate-100"
            : "border-primary/30 bg-primary/12 text-slate-50",
        ].join(" ")}
      >
        <div className="flex flex-col gap-3">
          {message.parts.map((part, index) => {
            if (part.type === "image") {
              return (
                <div key={`${message.id}-${index}`} className="overflow-hidden rounded-[20px] border border-white/10 bg-black/20">
                  {part.image.previewUrl ? (
                    <img
                      src={part.image.previewUrl}
                      alt={part.image.name}
                      className="max-h-64 w-full object-cover"
                    />
                  ) : (
                    <div className="flex min-h-36 flex-col items-center justify-center gap-2 px-4 py-6 text-center text-sm text-slate-300">
                      <p className="font-medium text-white">{part.image.name}</p>
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
                  className="text-sm leading-7 text-slate-100 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_li]:ml-4 [&_li]:list-disc [&_ol]:ml-4 [&_ol]:list-decimal [&_p]:leading-7 [&_strong]:font-semibold [&_ul]:space-y-1"
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {part.text}
                  </ReactMarkdown>
                </div>
              )
            }

            return (
              <p key={`${message.id}-${index}`} className="text-sm leading-7">
                {part.text}
              </p>
            )
          })}
          <span className="text-xs text-slate-400">
            {new Date(message.createdAt).toLocaleTimeString("zh-CN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </article>
  )
}
