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
    <Empty className="surface-panel-muted app-surface min-h-[220px] justify-center rounded-[28px] border border-dashed border-border/80 px-5 py-4 lg:min-h-[240px] lg:px-6 lg:py-5">
      <EmptyHeader className="max-w-3xl gap-2.5">
        <EmptyMedia>
          <div className="flex size-16 items-center justify-center rounded-[24px] border border-primary/20 bg-primary/10 ring-1 ring-primary/10">
            <img src={brandAiAvatarSrc} alt="SkinCareAI 助手头像" className="size-12 object-contain" />
          </div>
        </EmptyMedia>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            默认通用模型：{defaultGeneralName}
          </span>
          {!isUsingDefaultGeneralModel ? (
            <span className="rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
              当前会话：{currentModelName}
            </span>
          ) : null}
        </div>

        <EmptyTitle className="text-[1.55rem] leading-[1.08] font-semibold tracking-tight text-foreground lg:text-[1.9rem]">
          先问一个问题，再决定要不要细分模型
        </EmptyTitle>
        <EmptyDescription className="max-w-3xl text-sm leading-6 text-muted-foreground lg:text-base">
          直接问，或者上传一张皮肤图片再补一句部位、时长和主要感受。默认入口已经帮你把选择成本压到最低。
        </EmptyDescription>
      </EmptyHeader>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
        <span className="rounded-full border border-border/70 bg-background/70 px-3 py-1">文本和图片都能从这里开始</span>
        <span className="rounded-full border border-border/70 bg-background/70 px-3 py-1">切换模型会自动新建会话</span>
      </div>

      <EmptyContent className="mt-3 grid w-full max-w-4xl gap-3 lg:grid-cols-3">
        {starterPrompts.map((prompt) => (
          <Button
            key={prompt}
            type="button"
            variant="outline"
            className="h-auto min-h-[4.5rem] justify-start rounded-[22px] border-border/70 bg-background/70 px-4 py-3.5 text-left whitespace-normal text-foreground hover:bg-muted"
            onClick={() => onPromptSelect(prompt)}
          >
            <SparklesIcon data-icon="inline-start" className="text-primary" />
            <span>{prompt}</span>
          </Button>
        ))}
      </EmptyContent>

      <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
        <StethoscopeIcon className="size-4 text-primary" />
        仅供皮肤健康咨询与科普参考，不替代医生面诊和处方。
      </div>
    </Empty>
  )
}
