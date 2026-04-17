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

import { brandAiAvatarSrc } from "@/lib/brand-assets"
import { getModelDisplayName } from "@/lib/model-config"
import type { ModelDefinition } from "@/types/chat"

const starterPrompts = [
  "最近脸上反复长痘，日常护理应该怎么调整？",
  "敏感泛红和干燥起皮同时出现，先处理哪一个？",
  "我准备上传一张皮肤图片，还需要补充哪些描述？",
]

interface EmptyStateProps {
  currentModel: ModelDefinition
  defaultGeneralModel?: ModelDefinition | null
  onPromptSelect: (prompt: string) => void
}

export function EmptyState({
  currentModel,
  defaultGeneralModel,
  onPromptSelect,
}: EmptyStateProps) {
  const defaultGeneralName = getModelDisplayName(defaultGeneralModel || currentModel)
  const currentModelName = getModelDisplayName(currentModel)
  const isUsingDefaultGeneralModel = currentModel.id === defaultGeneralModel?.id

  return (
    <Empty className="surface-panel-muted app-surface min-h-[180px] justify-center rounded-[26px] border border-dashed border-border/80 px-4 py-4 lg:min-h-[200px] lg:px-5">
      <EmptyHeader className="max-w-3xl gap-2">
        <EmptyMedia>
          <div className="flex size-14 items-center justify-center rounded-[22px] border border-primary/20 bg-primary/10 ring-1 ring-primary/10">
            <img src={brandAiAvatarSrc} alt="SkinCareAI 助手头像" className="size-10 object-contain" />
          </div>
        </EmptyMedia>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary">
            默认通用模型：{defaultGeneralName}
          </span>
          {!isUsingDefaultGeneralModel ? (
            <span className="rounded-full border border-border/70 bg-background/70 px-3 py-1 text-[11px] font-medium text-muted-foreground">
              当前会话：{currentModelName}
            </span>
          ) : null}
        </div>

        <EmptyTitle className="text-[1.22rem] leading-[1.08] font-semibold tracking-tight text-foreground lg:text-[1.42rem]">
          先直接提问，模型细分放到下一步
        </EmptyTitle>
        <EmptyDescription className="max-w-3xl text-sm leading-6 text-muted-foreground">
          这里保留最短的起步路径：输入问题，或上传一张图片并补充部位、时长和主要感受。
        </EmptyDescription>
      </EmptyHeader>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-[11px] text-muted-foreground">
        <span className="rounded-full border border-border/70 bg-background/70 px-3 py-1">文本和图片都能从这里开始</span>
        <span className="rounded-full border border-border/70 bg-background/70 px-3 py-1">切换模型会自动新建会话</span>
      </div>

      <EmptyContent className="mt-3 grid w-full max-w-4xl gap-2.5 lg:grid-cols-3">
        {starterPrompts.map((prompt) => (
          <Button
            key={prompt}
            type="button"
            variant="outline"
            className="h-auto min-h-[4rem] justify-start rounded-[20px] border-border/70 bg-background/70 px-4 py-3 text-left whitespace-normal text-foreground hover:bg-muted"
            onClick={() => onPromptSelect(prompt)}
          >
            <SparklesIcon data-icon="inline-start" className="text-primary" />
            <span>{prompt}</span>
          </Button>
        ))}
      </EmptyContent>

      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
        <StethoscopeIcon className="size-4 text-primary" />
        仅供皮肤健康咨询与科普参考，不替代医生面诊和处方。
      </div>
    </Empty>
  )
}
