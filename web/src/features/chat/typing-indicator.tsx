import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Spinner } from "@/components/ui/spinner"

import { brandAiAvatarSrc } from "@/lib/brand-assets"

export function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <Avatar size="lg" className="mt-1 border border-primary/20 bg-primary/8">
        <AvatarImage src={brandAiAvatarSrc} alt="SkinCareAI" className="object-contain p-1" />
        <AvatarFallback>AI</AvatarFallback>
      </Avatar>
      <div className="surface-message-assistant flex max-w-sm items-center gap-3 rounded-[24px] border border-border/70 px-5 py-4 text-sm text-foreground shadow-[var(--surface-shadow-soft)]">
        <Spinner className="size-4 text-primary" />
        <span>正在生成本轮建议，请稍候…</span>
      </div>
    </div>
  )
}
