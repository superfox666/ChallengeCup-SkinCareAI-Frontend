import { useEffect, useMemo, useRef, useState } from "react"
import {
  BrainCircuitIcon,
  CircleIcon,
  CoinsIcon,
  GaugeIcon,
  ImageIcon,
  MessageSquareTextIcon,
  SignalIcon,
  SparklesIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ModelDefinition } from "@/types/chat"

interface ModelSelectorProps {
  models: ModelDefinition[]
  value: string
  onChange: (modelId: string) => void
}

type ModelCategory = "general" | "text" | "vision" | "reasoning" | "fast"

const categoryOrder: Array<{
  id: ModelCategory
  label: string
  description: string
}> = [
  {
    id: "general",
    label: "通用模型",
    description: "适合第一次使用或不想纠结时直接选择。",
  },
  {
    id: "text",
    label: "文本模型",
    description: "适合日常问答、整理和解释类任务。",
  },
  {
    id: "vision",
    label: "图片模型",
    description: "适合图片理解、图文联合提问和视觉分析。",
  },
  {
    id: "reasoning",
    label: "深度推理",
    description: "适合复杂分析、长链思考和高难度问题。",
  },
  {
    id: "fast",
    label: "低成本快速",
    description: "适合速度优先、成本敏感或轻量任务。",
  },
]

function getStatusTone(status: ModelDefinition["status"]) {
  if (status === "online") return "text-emerald-400"
  if (status === "degraded") return "text-amber-300"
  if (status === "offline") return "text-rose-400"
  return "text-slate-500"
}

function getSpeedLabel(speedLevel?: string) {
  if (speedLevel === "fast") return "快"
  if (speedLevel === "slow") return "慢"
  return "中"
}

function getPriceLabel(priceLevel?: string) {
  if (priceLevel === "low") return "低"
  if (priceLevel === "high") return "高"
  return "中"
}

function isGeneralModel(model: ModelDefinition) {
  return (
    model.recommendedScore !== undefined &&
    model.recommendedScore >= 4.6 &&
    (model.supportsImageInput || model.speedLevel !== "slow")
  )
}

function matchesCategory(model: ModelDefinition, category: ModelCategory) {
  if (category === "general") return isGeneralModel(model)
  if (category === "text") return model.sessionType === "text"
  if (category === "vision") return model.supportsImageInput
  if (category === "reasoning")
    return (model.capabilities || []).some((item) => item.includes("推理") || item.includes("思考"))
  if (category === "fast") return model.speedLevel === "fast" || model.priceLevel === "low"

  return false
}

function sortModels(models: ModelDefinition[]) {
  return [...models].sort((left, right) => {
    const scoreDiff = (right.recommendedScore || 0) - (left.recommendedScore || 0)
    if (scoreDiff !== 0) return scoreDiff

    const statusWeight = { online: 3, degraded: 2, unknown: 1, offline: 0, available: 1, disabled: -1 }
    const statusDiff =
      (statusWeight[right.status] ?? 0) - (statusWeight[left.status] ?? 0)
    if (statusDiff !== 0) return statusDiff

    return (left.displayName || left.name).localeCompare(right.displayName || right.name, "zh-CN")
  })
}

function ModelQuickMeta({ model }: { model: ModelDefinition }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
      <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/6 px-2 py-1">
        <GaugeIcon className="size-3.5" />
        速度 {getSpeedLabel(model.speedLevel)}
      </span>
      <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/6 px-2 py-1">
        <CoinsIcon className="size-3.5" />
        成本 {getPriceLabel(model.priceLevel)}
      </span>
      <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/6 px-2 py-1">
        <SignalIcon className="size-3.5" />
        {model.networkHint || "待实测"}
      </span>
    </div>
  )
}

export function ModelSelector({ models, value, onChange }: ModelSelectorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [open, setOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<ModelCategory>("general")

  const currentModel = models.find((model) => model.id === value)

  const groupedModels = useMemo(
    () =>
      Object.fromEntries(
        categoryOrder.map((category) => [
          category.id,
          sortModels(models.filter((model) => matchesCategory(model, category.id))),
        ])
      ) as Record<ModelCategory, ModelDefinition[]>,
    [models]
  )

  const activeModels = groupedModels[activeCategory]

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
        className="flex w-full min-w-0 items-center justify-between rounded-[22px] border border-white/12 bg-white/6 px-4 py-3 text-left text-white transition-colors hover:bg-white/8"
        onClick={() => setOpen((current) => !current)}
      >
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">
            {currentModel?.displayName || currentModel?.name || "选择模型"}
          </p>
          <p className="truncate text-xs text-slate-400">
            {currentModel?.description || currentModel?.summary || "选择适合当前任务的模型"}
          </p>
        </div>
        <div className="ml-4 flex shrink-0 items-center gap-2 text-xs">
          <span className={cn("inline-flex items-center gap-1", getStatusTone(currentModel?.status || "unknown"))}>
            <CircleIcon className="size-2 fill-current" />
            {currentModel?.latencyMs ? `${currentModel.latencyMs} ms` : "--"}
          </span>
          {currentModel?.supportsImageInput ? (
            <ImageIcon className="size-4 text-primary" />
          ) : (
            <MessageSquareTextIcon className="size-4 text-slate-400" />
          )}
        </div>
      </button>

      {open ? (
        <div className="absolute z-50 mt-3 flex w-[min(720px,calc(100vw-2rem))] flex-col gap-4 rounded-[28px] border border-white/10 bg-[#0c1730] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.42)]">
          <div className="flex flex-wrap gap-2">
            {categoryOrder.map((category) => (
              <Button
                key={category.id}
                type="button"
                variant={activeCategory === category.id ? "default" : "outline"}
                className="rounded-2xl border-white/12 bg-white/6 text-slate-100 hover:bg-white/8"
                onClick={() => setActiveCategory(category.id)}
              >
                {category.label}
              </Button>
            ))}
          </div>

          <div className="text-sm leading-7 text-slate-400">
            {categoryOrder.find((category) => category.id === activeCategory)?.description}
          </div>

          <div className="grid max-h-[420px] gap-3 overflow-y-auto pr-1">
            {activeModels.map((model) => (
              <button
                key={model.id}
                type="button"
                className={cn(
                  "flex flex-col gap-3 rounded-[24px] border px-4 py-4 text-left transition-colors",
                  model.id === value
                    ? "border-primary/40 bg-primary/12"
                    : "border-white/10 bg-white/5 hover:bg-white/8"
                )}
                onClick={() => {
                  onChange(model.id)
                  setOpen(false)
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-base font-semibold text-white">
                        {model.displayName || model.name}
                      </p>
                      <Badge variant="outline" className="border-white/12 bg-white/6 text-slate-200">
                        <SparklesIcon data-icon="inline-start" />
                        {model.recommendedScore?.toFixed(1) || "--"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-slate-300">
                      {model.description || model.summary}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <span className={cn("inline-flex items-center gap-1 text-xs", getStatusTone(model.status))}>
                      <CircleIcon className="size-2 fill-current" />
                      {model.status === "online"
                        ? "畅通"
                        : model.status === "degraded"
                          ? "较慢"
                          : model.status === "offline"
                            ? "不可用"
                            : "待检测"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <Badge variant="outline" className="border-white/10 bg-white/6 text-slate-200">
                    {model.latencyMs ? `${model.latencyMs} ms` : "--"}
                  </Badge>
                  <Badge variant="outline" className="border-white/10 bg-white/6 text-slate-200">
                    <GaugeIcon data-icon="inline-start" />
                    {getSpeedLabel(model.speedLevel)}
                  </Badge>
                  <Badge variant="outline" className="border-white/10 bg-white/6 text-slate-200">
                    <CoinsIcon data-icon="inline-start" />
                    {getPriceLabel(model.priceLevel)}
                  </Badge>
                  <Badge variant="outline" className="border-white/10 bg-white/6 text-slate-200">
                    <SignalIcon data-icon="inline-start" />
                    {model.networkHint || "待实测"}
                  </Badge>
                  {model.supportsImageInput ? (
                    <Badge variant="outline" className="border-primary/20 bg-primary/10 text-slate-100">
                      <ImageIcon data-icon="inline-start" />
                      图片
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-white/10 bg-white/6 text-slate-200">
                      <MessageSquareTextIcon data-icon="inline-start" />
                      文本
                    </Badge>
                  )}
                  {(model.capabilities || []).some((item) => item.includes("推理") || item.includes("思考")) ? (
                    <Badge variant="outline" className="border-white/10 bg-white/6 text-slate-200">
                      <BrainCircuitIcon data-icon="inline-start" />
                      推理
                    </Badge>
                  ) : null}
                </div>

                <ModelQuickMeta model={model} />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
