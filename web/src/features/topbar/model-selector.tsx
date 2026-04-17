import { useEffect, useMemo, useRef, useState } from "react"
import { ChevronDownIcon, RefreshCwIcon, SparklesIcon, StarIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { InfoHint } from "@/components/ui/info-hint"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  getDefaultGeneralModel,
  getModelCapabilityBadges,
  getModelDisplayName,
  getModelProviderLabel,
  getModelPrimaryHint,
  getModelPriceMeta,
  getModelRoleLabel,
  getModelSpeedMeta,
  getNetworkLabel,
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
  refreshAt?: string | null
  refreshing?: boolean
  onRefresh?: () => void
  onChange: (modelId: string) => void
  inline?: boolean
}

type SelectorCategory = (typeof modelCategoryOrder)[number]["id"]

function formatRefreshTime(refreshAt?: string | null) {
  if (!refreshAt) {
    return null
  }

  const parsed = new Date(refreshAt)

  if (Number.isNaN(parsed.getTime())) {
    return null
  }

  return parsed.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

export function ModelSelector({
  models,
  value,
  defaultGeneralModelId,
  refreshAt,
  refreshing = false,
  onRefresh,
  onChange,
  inline = false,
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
          sortModelsByPriority(
            models.filter((model) => matchesModelCategory(model, category.id, models))
          ),
        ])
      ) as Record<SelectorCategory, ModelDefinition[]>,
    [models]
  )

  const requestedModels = groupedModels[activeCategory] ?? []
  const resolvedActiveCategory = requestedModels.length > 0 ? activeCategory : "general"
  const activeModels = groupedModels[resolvedActiveCategory] ?? []
  const showPanel = inline || open
  const activeCategoryMeta = modelCategoryOrder.find((item) => item.id === resolvedActiveCategory)
  const lastRefreshLabel = useMemo(() => formatRefreshTime(refreshAt), [refreshAt])

  const selectorDescription = inline
    ? "分类固定，列表独立滚动，支持 5 秒自动检测和手动重测。"
    : activeCategoryMeta?.description

  const defaultModelBanner = defaultGeneralModel ? (
    <div
      className={cn(
        "surface-panel-muted rounded-[24px] border border-border/70",
        inline ? "px-3 py-2" : "p-4"
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 space-y-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium text-foreground">默认通用入口</p>
            <Badge
              variant="outline"
              className="h-6 rounded-full border-primary/30 bg-primary/10 px-2 text-primary"
            >
              <SparklesIcon data-icon="inline-start" className="size-3.5" />
              推荐起点
            </Badge>
          </div>
          <p
            className={cn(
              "text-sm text-muted-foreground",
              inline ? "line-clamp-1 text-xs leading-5" : "leading-7"
            )}
          >
            <span translate="no">{getModelDisplayName(defaultGeneralModel)}</span>
            {inline
              ? " 适合作为首选入口。"
              : " 适合作为日常首选入口，文字问诊和图片 handoff 都能接住。"}
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          className={cn("rounded-full px-3", inline ? "h-7 text-xs" : "h-9")}
          onClick={() => {
            onChange(defaultGeneralModel.id)
            setOpen(false)
          }}
        >
          切到 <span translate="no">{getModelDisplayName(defaultGeneralModel)}</span>
        </Button>
      </div>
    </div>
  ) : null

  useEffect(() => {
    if (inline) {
      return
    }

    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    window.addEventListener("mousedown", handleClickOutside)
    return () => window.removeEventListener("mousedown", handleClickOutside)
  }, [inline])

  return (
    <div
      ref={containerRef}
      className={cn("relative", inline ? "flex h-full min-h-0 flex-col overflow-hidden" : "")}
    >
      {!inline ? (
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
                <Badge
                  variant="outline"
                  className="h-6 rounded-full border-primary/30 bg-primary/10 px-2 text-primary"
                >
                  <SparklesIcon data-icon="inline-start" className="size-3.5" />
                  默认通用模型
                </Badge>
              ) : null}
            </div>
            <p className="truncate text-sm font-semibold text-foreground">
              {getModelDisplayName(currentModel)}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {currentModel
                ? getModelPrimaryHint(currentModel, defaultGeneralModel?.id)
                : "请选择模型"}
            </p>
          </div>
          <div className="ml-4 flex shrink-0 items-center gap-3">
            {currentModel ? <ModelRecommendationMeter score={currentModel.recommendedScore} /> : null}
            <ChevronDownIcon
              className={cn(
                "size-4 text-muted-foreground transition-transform",
                open ? "rotate-180" : ""
              )}
            />
          </div>
        </button>
      ) : null}

      {showPanel ? (
        <div
          className={cn(
            "surface-panel flex w-full min-w-0 flex-col gap-4 rounded-[30px] border border-border/70 p-4 shadow-[var(--surface-shadow-strong)]",
            inline ? "h-full min-h-0 gap-2 overflow-hidden rounded-[32px] border-primary/20 p-2.5 ring-1 ring-primary/10" : "",
            inline ? "" : "absolute right-0 z-50 mt-3 max-w-[min(920px,calc(100vw-2rem))]"
          )}
        >
          <div className={cn("shrink-0", inline ? "space-y-2.5" : "space-y-4")}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium uppercase tracking-[0.24em] text-primary/80">
                    分类 / 模型
                  </p>
                  <InfoHint
                    label="模型选择器"
                    content="默认推荐模型会排在前面。没有明确原因时，不需要逐个试；先用默认模型，只有任务类型变化时再切换分类。"
                    mode="popover"
                    align="start"
                  />
                </div>
                <h3
                  className={cn(
                    "font-semibold tracking-tight text-foreground",
                    inline ? "text-base" : "text-lg"
                  )}
                >
                  {activeCategoryMeta?.label}
                </h3>
                <p
                  className={cn(
                    "text-muted-foreground",
                    inline ? "max-w-none line-clamp-1 text-[11px] leading-4" : "max-w-2xl text-sm leading-7"
                  )}
                >
                  {selectorDescription}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-full border-border/70 bg-background/70 px-2.5",
                    inline ? "h-5 text-[10px] text-foreground" : "h-7 text-foreground"
                  )}
                >
                  当前 <span translate="no">{getModelDisplayName(currentModel)}</span>
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-full border-border/70 bg-background/70 px-2.5 text-muted-foreground",
                    inline ? "h-5 text-[10px]" : "h-7"
                  )}
                >
                  {models.length} 个模型
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-full border-border/70 bg-background/70 px-2.5 text-muted-foreground",
                    inline ? "h-5 text-[10px]" : "h-7"
                  )}
                >
                  当前分类 {activeModels.length} 个候选
                </Badge>
                {lastRefreshLabel ? (
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-full border-border/70 bg-background/70 px-2.5 text-muted-foreground",
                      inline ? "h-5 text-[10px]" : "h-7"
                    )}
                  >
                    最近检测 {lastRefreshLabel}
                  </Badge>
                ) : null}
                {onRefresh ? (
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "rounded-full border-border/70 bg-background/70 text-foreground hover:bg-muted",
                      inline ? "h-6 px-2 text-[10px]" : "h-8 px-3"
                    )}
                    onClick={onRefresh}
                    disabled={refreshing}
                  >
                    <RefreshCwIcon
                      data-icon="inline-start"
                      className={cn("size-4", refreshing ? "animate-spin" : "")}
                    />
                    {refreshing ? "连通性测试中" : "连通性测试"}
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
              {modelCategoryOrder.map((category) => (
                <Button
                  key={category.id}
                  type="button"
                  variant={resolvedActiveCategory === category.id ? "default" : "outline"}
                  className={cn(
                    "shrink-0",
                    inline ? "h-7 rounded-2xl px-2.5 text-[11px]" : "h-11 rounded-2xl px-4 text-sm"
                  )}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {`${category.label} / ${categoryCounts[category.id]}`}
                </Button>
              ))}
            </div>

            {!inline ? defaultModelBanner : null}
          </div>

          <ScrollArea
            className={cn(
              "min-h-0 flex-1 overscroll-contain pr-1",
              inline ? "" : "max-h-[min(58dvh,620px)]"
            )}
          >
            <div className={cn("grid min-h-0 pb-1", inline ? "gap-2" : "gap-3")}>
              {inline ? defaultModelBanner : null}

              {activeModels.length === 0 ? (
                <div className="surface-panel-muted rounded-[24px] border border-border/70 px-4 py-5 text-sm leading-7 text-muted-foreground">
                  当前分类下没有可选模型，请先回到“通用模型”或“图片模型”查看。
                </div>
              ) : null}

              {activeModels.map((model) => {
                const speedMeta = getModelSpeedMeta(model.speedLevel)
                const priceMeta = getModelPriceMeta(model.priceLevel)
                const capabilityBadges = getModelCapabilityBadges(model, defaultGeneralModel?.id)
                const providerLabel = getModelProviderLabel(model)
                const networkLabel = getNetworkLabel(model.networkHint)

                return (
                  <button
                    key={model.id}
                    type="button"
                    className={cn(
                      "flex flex-col rounded-[20px] border text-left transition-colors",
                      inline ? "gap-1.5 px-3 py-2" : "gap-2.5 px-3.5 py-3.5 sm:px-4 sm:py-4",
                      model.id === value
                        ? "border-primary/40 bg-primary/12"
                        : "border-border/70 bg-background/60 hover:border-primary/20 hover:bg-muted/60"
                    )}
                    onClick={() => {
                      onChange(model.id)
                      setOpen(false)
                    }}
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <p
                            className={cn(
                              "truncate font-semibold text-foreground",
                              inline ? "text-sm sm:text-[0.96rem]" : "text-base sm:text-[1.02rem]"
                            )}
                          >
                            <span translate="no">{getModelDisplayName(model)}</span>
                          </p>
                          <Badge
                            variant="outline"
                            className={cn(
                              "rounded-full border-border/70 bg-background/75 px-2 text-muted-foreground",
                              inline ? "h-5 text-[10px]" : "h-6"
                            )}
                          >
                            {getModelRoleLabel(model, defaultGeneralModel?.id)}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={cn(
                              "rounded-full border-border/70 bg-background/75 px-2 text-muted-foreground",
                              inline ? "h-5 text-[10px]" : "h-6"
                            )}
                          >
                            <span translate="no">{providerLabel}</span>
                          </Badge>
                        </div>
                        <p
                          className={cn(
                            "line-clamp-2 text-muted-foreground",
                            inline ? "line-clamp-1 text-[11px] leading-4" : "text-sm leading-6"
                          )}
                        >
                          {getModelPrimaryHint(model, defaultGeneralModel?.id)}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <ModelStatusBadge model={model} />
                        <div className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-background/80 px-1.5 py-0.5 text-[10px] font-semibold text-foreground/90">
                          <StarIcon className="size-3 fill-amber-400 text-amber-400" />
                          {model.recommendedScore ? model.recommendedScore.toFixed(1) : "--"}
                        </div>
                      </div>
                    </div>

                    {inline ? (
                      <>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="rounded-full border border-border/70 bg-background/80 px-2 py-1 text-[11px] text-foreground/90">
                            速度 {speedMeta.shortLabel}
                          </span>
                          <span className="rounded-full border border-border/70 bg-background/80 px-2 py-1 text-[11px] text-foreground/90">
                            成本 {priceMeta.shortLabel}
                          </span>
                          <span className="rounded-full border border-border/70 bg-background/80 px-2 py-1 text-[11px] text-foreground/90">
                            {model.latencyMs ? `${model.latencyMs} ms` : "待测"}
                          </span>
                          <span className="rounded-full border border-border/70 bg-background/80 px-2 py-1 text-[11px] text-muted-foreground">
                            {networkLabel}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {capabilityBadges.map((item) => (
                            <Badge
                              key={item.id}
                              variant="outline"
                              className={cn(
                                "h-5 rounded-full border-border/70 bg-background/75 px-2 text-[10px] text-foreground/90",
                                item.id === "default" ? "border-primary/35 bg-primary/12 text-primary" : ""
                              )}
                            >
                              {item.label}
                            </Badge>
                          ))}
                        </div>
                      </>
                    ) : null}

                    {!inline ? (
                      <>
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

                        <ModelCapabilityPills
                          model={model}
                          defaultGeneralModelId={defaultGeneralModel?.id}
                        />
                      </>
                    ) : null}
                  </button>
                )
              })}
            </div>
          </ScrollArea>
        </div>
      ) : null}
    </div>
  )
}
