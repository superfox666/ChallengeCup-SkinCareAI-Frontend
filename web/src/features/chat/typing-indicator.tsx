import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Spinner } from "@/components/ui/spinner"

import aiAvatar from "@/assets/brand/ai-avatar.png"

export function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <Avatar size="lg" className="mt-1 border border-primary/20 bg-primary/8">
        <AvatarImage src={aiAvatar} alt="SkinCareAI" className="object-contain p-1" />
        <AvatarFallback>AI</AvatarFallback>
      </Avatar>
      <div className="flex max-w-sm items-center gap-3 rounded-[24px] border border-white/10 bg-white/6 px-5 py-4 text-sm text-slate-200 shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
        <Spinner className="size-4 text-primary" />
        <span>正在生成本轮建议，请稍候…</span>
      </div>
    </div>
  )
}
