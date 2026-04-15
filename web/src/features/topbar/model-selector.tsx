import { useEffect, useMemo, useRef, useState } from "react"
import { ChevronDownIcon, SparklesIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { InfoHint } from "@/components/ui/info-hint"
import {
  getDefaultGeneralModel,
  getModelDisplayName,
  getModelPrimaryHint,
  getModelPriceMeta,
  getModelRoleLabel,
  getModelSpeedMeta,
  matchesModelCategory,
  modelCategoryOrder,
  sortModelsByPriority,
} from "@/lib/model-config"
import { cn } from "@/lib/utils"
import type { ModelDefinition } from "@/types/chat"
import {
  ModelCapabilityPills,
  ModelMetaPill,
  ModelRecommendationMeter,
  ModelSignalBadge,
  ModelStatusBadge,
} from "@/features/topbar/model-ui"

interface ModelSelectorProps {
  models: ModelDefinition[]
  value: string
  defaultGeneralModelId?: string | null
  onChange: (modelId: string) => void
}

type SelectorCategory = (typeof modelCategoryOrder)[number]["id"]

export function ModelSelector({
  models,
  value,
  defaultGeneralModelId,
  onChange,
}: ModelSelectorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [open, setOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<SelectorCategory>("general")

  const currentModel = models.find((model) => model.id === value)
  const defaultGeneralModel =
    models.find((model) => model.id === defaultGeneralModelId) ?? getDefaultGeneralModel(models)
  const categoryCounts = useMemo(
    () =>
      Object.fromEntries(
        modelCategoryOrder.map((category) => [
          category.id,
          models.filter((model) => matchesModelCategory(model, category.id, models)).length,
        ])
      ) as Record<SelectorCategory, number>,
    [models]
  )
  const groupedModels = useMemo(
    () =>
      Object.fromEntries(
        modelCategoryOrder.map((category) => [
          category.id,
          sortModelsByPriority(models.filter((model) => matchesModelCategory(model, category.id, models))),
        ])
      ) as Record<SelectorCategory, ModelDefinition[]>,
    [models]
  )

  const requestedModels = groupedModels[activeCategory] ?? []
  const resolvedActiveCategory = requestedModels.length > 0 ? activeCategory : "general"
  const activeModels = groupedModels[resolvedActiveCategory] ?? []

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    window.addEventListener("mousedown", handleClickOutside)
    return () => window.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        className="surface-panel-muted flex w-full min-w-0 items-center justify-between rounded-[24px] border border-border/70 px-4 py-3 text-left shadow-[var(--surface-shadow-soft)] transition-all hover:border-primary/30 hover:bg-muted/60"
        onClick={() => setOpen((current) => !current)}
      >
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[0.7rem] font-medium uppercase tracking-[0.28em] text-primary/80">
              模型选择器
            </span>
            {currentModel?.id === defaultGeneralModel?.id ? (
              <Badge variant="outline" className="h-6 rounded-full border-primary/30 bg-primary/10 px-2 text-primary">
                <SparklesIcon data-icon="inline-start" className="size-3.5" />
                默认通用模型
              </Badge>
            ) : null}
          </div>
          <p className="truncate text-sm font-semibold text-foreground">
            {getModelDisplayName(currentModel)}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {currentModel ? getModelPrimaryHint(currentModel, defaultGeneralModel?.id) : "请选择模型"}
          </p>
        </div>
        <div className="ml-4 flex shrink-0 items-center gap-3">
          {currentModel ? <ModelRecommendationMeter score={currentModel.recommendedScore} /> : null}
          <ChevronDownIcon
            className={cn("size-4 text-muted-foreground transition-transform", open ? "rotate-180" : "")}
          />
        </div>
      </button>

      {open ? (
        <div className="surface-panel absolute right-0 z-50 mt-3 flex w-[min(900px,calc(100vw-2rem))] flex-col gap-4 rounded-[30px] border border-border/70 p-4 shadow-[var(--surface-shadow-strong)]">
          <div className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium uppercase tracking-[0.24em] text-primary/80">
                    先选分类，再选模型
                  </p>
                  <InfoHint
                    label="模型选择器"
                    content="默认推荐模型已经放在最前面。没有明确理由时，不需要挨个试；先用默认模型，只有任务发生变化时再切分类。"
                    align="start"
                  />
                </div>
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                  {modelCategoryOrder.find((item) => item.id === resolvedActiveCategory)?.label}
                </h3>
                <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                  {modelCategoryOrder.find((item) => item.id === resolvedActiveCategory)?.description}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="h-7 rounded-full border-border/70 bg-background/70 px-2.5 text-foreground">
                  当前：{getModelDisplayName(currentModel)}
                </Badge>
                <Badge
                  variant="outline"
                  className="h-7 rounded-full border-border/70 bg-background/70 px-2.5 text-muted-foreground"
                >
                  {activeModels.length} 个候选
                </Badge>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {modelCategoryOrder.map((category) => (
                <Button
                  key={category.id}
                  type="button"
                  variant={resolvedActiveCategory === category.id ? "default" : "outline"}
                  className="h-9 rounded-full px-3"
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.label} · {categoryCounts[category.id]}
                </Button>
              ))}
            </div>

            {defaultGeneralModel ? (
              <div className="surface-panel-muted rounded-[24px] border border-border/70 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">默认通用模型</p>
                      <Badge
                        variant="outline"
                        className="h-6 rounded-full border-primary/30 bg-primary/10 px-2 text-primary"
                      >
                        <SparklesIcon data-icon="inline-start" className="size-3.5" />
                        推荐起点
                      </Badge>
                    </div>
                    <p className="text-sm leading-7 text-muted-foreground">
                      {getModelDisplayName(defaultGeneralModel)} 适合作为现场演示入口，先问文字问题也能直接接图片 handoff 规则。
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    className="h-8 rounded-full px-3"
                    onClick={() => {
                      onChange(defaultGeneralModel.id)
                      setOpen(false)
                    }}
                  >
                    切到 {getModelDisplayName(defaultGeneralModel)}
                  </Button>
                </div>
              </div>
            ) : null}
          </div>

          <div className="grid max-h-[420px] gap-3 overflow-y-auto pr-1">
            {activeModels.length === 0 ? (
              <div className="surface-panel-muted rounded-[24px] border border-border/70 px-4 py-5 text-sm leading-7 text-muted-foreground">
                当前分类下没有可选模型，请先回到“通用模型”或“图片模型”查看。
              </div>
            ) : null}
            {activeModels.map((model) => {
              const speedMeta = getModelSpeedMeta(model.speedLevel)
              const priceMeta = getModelPriceMeta(model.priceLevel)

              return (
                <button
                  key={model.id}
                  type="button"
                  className={cn(
                    "flex flex-col gap-3 rounded-[24px] border px-4 py-4 text-left transition-colors",
                    model.id === value
                      ? "border-primary/40 bg-primary/12"
                      : "border-border/70 bg-background/60 hover:border-primary/20 hover:bg-muted/60"
                  )}
                  onClick={() => {
                    onChange(model.id)
                    setOpen(false)
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-base font-semibold text-foreground">
                          {getModelDisplayName(model)}
                        </p>
                        <Badge
                          variant="outline"
                          className="h-6 rounded-full border-border/70 bg-background/75 px-2 text-muted-foreground"
                        >
                          {getModelRoleLabel(model, defaultGeneralModel?.id)}
                        </Badge>
                      </div>
                      <p className="text-sm leading-7 text-muted-foreground">
                        {getModelPrimaryHint(model, defaultGeneralModel?.id)}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <ModelStatusBadge model={model} />
                      <ModelRecommendationMeter score={model.recommendedScore} />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <ModelMetaPill icon="speed" label="速度" value={speedMeta.shortLabel} />
                    <ModelMetaPill icon="cost" label="成本" value={priceMeta.shortLabel} />
                    <ModelMetaPill
                      icon="latency"
                      label="延迟"
                      value={model.latencyMs ? `${model.latencyMs} ms` : "待测"}
                    />
                    <ModelSignalBadge hint={model.networkHint} />
                  </div>

                  <ModelCapabilityPills model={model} defaultGeneralModelId={defaultGeneralModel?.id} />
                </button>
              )
            })}
          </div>
        </div>
      ) : null}
    </div>
  )
}
