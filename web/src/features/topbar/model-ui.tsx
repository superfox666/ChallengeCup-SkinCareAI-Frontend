import {
  ActivityIcon,
  BrainCircuitIcon,
  CircleIcon,
  CoinsIcon,
  GaugeIcon,
  ImageIcon,
  MessageSquareTextIcon,
  ShieldCheckIcon,
  SignalIcon,
  SparklesIcon,
  StarIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  getModelCapabilityBadges,
  getModelDisplayName,
  getModelPrimaryHint,
  getModelPriceMeta,
  getModelRoleLabel,
  getModelSpeedMeta,
  getModelStatusLabel,
  getNetworkLabel,
  getNetworkStrength,
} from "@/lib/model-config"
import type { ModelDefinition } from "@/types/chat"

const capabilityIcons = {
  text: MessageSquareTextIcon,
  image: ImageIcon,
  reasoning: BrainCircuitIcon,
  default: ShieldCheckIcon,
} as const

function getStatusTone(status?: ModelDefinition["status"]) {
  if (status === "online") return "text-emerald-500"
  if (status === "degraded") return "text-amber-500"
  if (status === "offline" || status === "disabled") return "text-rose-500"

  return "text-muted-foreground"
}

export function ModelRecommendationMeter({ score }: { score?: number }) {
  const normalizedScore = Math.max(0, Math.min(5, score || 0))
  const activeStars = Math.round(normalizedScore)

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-2.5 py-1 text-xs text-foreground/90">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <StarIcon
            key={index}
            className={cn(
              "size-3.5",
              index < activeStars
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground/35"
            )}
          />
        ))}
      </div>
      <span className="font-semibold">{normalizedScore > 0 ? normalizedScore.toFixed(1) : "--"}</span>
    </div>
  )
}

export function ModelStatusBadge({ model }: { model: ModelDefinition }) {
  return (
    <div className={cn("inline-flex items-center gap-1.5 text-xs font-medium", getStatusTone(model.status))}>
      <CircleIcon className="size-2.5 fill-current" />
      <span>{getModelStatusLabel(model.status)}</span>
    </div>
  )
}

export function ModelSignalBadge({ hint }: { hint?: string }) {
  const strength = getNetworkStrength(hint)

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/75 px-2.5 py-1 text-xs text-muted-foreground">
      <SignalIcon className="size-3.5 text-primary" />
      <div className="flex items-end gap-0.5">
        {Array.from({ length: 3 }).map((_, index) => (
          <span
            key={index}
            className={cn(
              "w-1 rounded-full",
              index === 0 ? "h-2" : index === 1 ? "h-3" : "h-4",
              index < strength ? "bg-primary" : "bg-border"
            )}
          />
        ))}
      </div>
      <span>{getNetworkLabel(hint)}</span>
    </div>
  )
}

export function ModelMetaPill({
  icon,
  label,
  value,
}: {
  icon: "speed" | "cost" | "latency"
  label: string
  value: string
}) {
  const Icon = icon === "speed" ? GaugeIcon : icon === "cost" ? CoinsIcon : ActivityIcon

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-2.5 py-1 text-xs text-foreground/90">
      <Icon className="size-3.5 text-primary" />
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

export function ModelCapabilityPills({
  model,
  defaultGeneralModelId,
}: {
  model: ModelDefinition
  defaultGeneralModelId?: string | null
}) {
  const capabilityBadges = getModelCapabilityBadges(model, defaultGeneralModelId)

  return (
    <div className="flex flex-wrap items-center gap-2">
      {capabilityBadges.map((item) => {
        const Icon = capabilityIcons[item.id as keyof typeof capabilityIcons]

        return (
          <Badge
            key={item.id}
            variant="outline"
            className={cn(
              "h-7 rounded-full border-border/70 bg-background/75 px-2.5 text-[11px] text-foreground/90",
              item.id === "default" ? "border-primary/35 bg-primary/12 text-primary" : ""
            )}
          >
            <Icon data-icon="inline-start" className="size-3.5" />
            {item.label}
          </Badge>
        )
      })}
    </div>
  )
}

export function ModelHeroSummary({
  model,
  defaultGeneralModelId,
}: {
  model: ModelDefinition
  defaultGeneralModelId?: string | null
}) {
  const speedMeta = getModelSpeedMeta(model.speedLevel)
  const priceMeta = getModelPriceMeta(model.priceLevel)

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="h-7 rounded-full border-primary/30 bg-primary/10 px-2.5 text-primary">
              <SparklesIcon data-icon="inline-start" className="size-3.5" />
              {getModelRoleLabel(model, defaultGeneralModelId)}
            </Badge>
            <ModelStatusBadge model={model} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              {getModelDisplayName(model)}
            </h3>
            <ModelRecommendationMeter score={model.recommendedScore} />
          </div>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            {getModelPrimaryHint(model, defaultGeneralModelId)}
          </p>
        </div>
        <ModelSignalBadge hint={model.networkHint} />
      </div>

      <div className="flex flex-wrap gap-2">
        <ModelMetaPill icon="speed" label="速度" value={speedMeta.label} />
        <ModelMetaPill icon="cost" label="成本" value={priceMeta.label} />
        <ModelMetaPill
          icon="latency"
          label="延迟"
          value={model.latencyMs ? `${model.latencyMs} ms` : "待测"}
        />
      </div>

      <ModelCapabilityPills model={model} defaultGeneralModelId={defaultGeneralModelId} />
    </div>
  )
}
