import { SparklesIcon, StethoscopeIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

import aiAvatar from "@/assets/brand/ai-avatar.png"

const starterPrompts = [
  "最近脸上反复长痘，日常护理应该怎么调整？",
  "敏感泛红和干燥起皮同时出现，先处理哪一个？",
  "上传皮肤图片后，我应该补充哪些描述信息？",
]

interface EmptyStateProps {
  onPromptSelect: (prompt: string) => void
}

export function EmptyState({ onPromptSelect }: EmptyStateProps) {
  return (
    <Empty className="min-h-[360px] justify-center rounded-[30px] border border-dashed border-white/12 bg-[linear-gradient(180deg,rgba(18,36,67,0.64),rgba(11,19,35,0.64))] px-6 py-8 lg:min-h-[400px] lg:px-7 lg:py-9">
      <EmptyHeader className="max-w-2xl gap-4">
        <EmptyMedia>
          <div className="flex size-22 items-center justify-center rounded-[30px] bg-primary/12 ring-1 ring-primary/20">
            <img src={aiAvatar} alt="SkinCareAI 助手头像" className="size-18 object-contain" />
          </div>
        </EmptyMedia>
        <EmptyTitle className="text-[2.6rem] leading-[1.06] font-semibold tracking-tight text-white lg:text-[3rem]">
          SkinCareAI 已准备就绪
        </EmptyTitle>
        <EmptyDescription className="max-w-2xl text-base leading-8 text-slate-300">
          先从一个清晰的问题开始，或上传单张皮肤图片并补充描述。当前为
          Batch 1 mock 演示，不接真实模型接口。
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="mt-6 grid w-full max-w-3xl gap-3 lg:grid-cols-3">
        {starterPrompts.map((prompt) => (
          <Button
            key={prompt}
            type="button"
            variant="outline"
            className="h-auto min-h-24 justify-start rounded-[22px] border-white/12 bg-white/5 px-4 py-4 text-left whitespace-normal text-slate-100 hover:bg-white/8"
            onClick={() => onPromptSelect(prompt)}
          >
            <SparklesIcon data-icon="inline-start" />
            <span>{prompt}</span>
          </Button>
        ))}
      </EmptyContent>
      <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
        <StethoscopeIcon className="size-4 text-primary" />
        仅供皮肤健康咨询与科普参考，不替代医生面诊和处方。
      </div>
    </Empty>
  )
}
