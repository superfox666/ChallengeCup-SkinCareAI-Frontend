import { ArrowRightIcon, CheckCircle2Icon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InfoHint } from "@/components/ui/info-hint"
import {
  ModelCapabilityPills,
  ModelMetaPill,
  ModelSignalBadge,
  ModelStatusBadge,
} from "@/features/topbar/model-ui"
import {
  getModelDisplayName,
  getModelPrimaryHint,
  getModelPriceMeta,
  getModelSpeedMeta,
} from "@/lib/model-config"
import type { ModelDefinition } from "@/types/chat"

interface ModelCapabilityCardProps {
  model: ModelDefinition
  defaultGeneralModel?: ModelDefinition | null
}

export function ModelCapabilityCard({
  model,
  defaultGeneralModel,
}: ModelCapabilityCardProps) {
  const isDefaultGeneralModel = model.id === defaultGeneralModel?.id
  const speedMeta = getModelSpeedMeta(model.speedLevel)
  const priceMeta = getModelPriceMeta(model.priceLevel)

  return (
    <Card className="surface-panel app-surface rounded-[28px] border border-border/70 text-foreground shadow-[var(--surface-shadow-soft)]">
      <CardHeader className="space-y-2 pb-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CardTitle>当前模型能力</CardTitle>
            <InfoHint
              label="当前模型能力"
              content="这里保留当前模型的短状态、速度、成本、延迟和能力标签。详细切换动作在模型标签页完成。"
              mode="popover"
              align="start"
            />
          </div>
          <Badge
            variant="outline"
            className="h-7 rounded-full border-border/70 bg-background/70 px-2.5 text-foreground"
          >
            {model.supportsImageInput ? "图文问诊" : "文本问诊"}
          </Badge>
        </div>
        <CardDescription className="text-sm leading-6 text-muted-foreground">
          当前会话固定绑定 <span translate="no">{getModelDisplayName(model)}</span>。切换模型会新建会话，不混用上下文。
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 pb-4.5">
        <div className="flex flex-wrap items-center gap-2">
          <ModelStatusBadge model={model} />
          <ModelSignalBadge hint={model.networkHint} />
        </div>

        <div className="flex flex-wrap gap-2">
          <ModelMetaPill icon="speed" label="速度" value={speedMeta.shortLabel} />
          <ModelMetaPill icon="cost" label="成本" value={priceMeta.shortLabel} />
          <ModelMetaPill
            icon="latency"
            label="延迟"
            value={model.latencyMs ? `${model.latencyMs} ms` : "待测"}
          />
        </div>

        <ModelCapabilityPills model={model} defaultGeneralModelId={defaultGeneralModel?.id} />

        <div className="rounded-[20px] border border-border/70 bg-background/60 p-3.5">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <CheckCircle2Icon className="size-4 text-primary" />
            <span>当前定位</span>
            <InfoHint
              label="当前定位"
              content="这里说明当前模型在整套演示链路中的角色，帮助你快速判断它是不是默认入口。"
              mode="popover"
              align="start"
            />
          </div>
          <ul className="mt-2 flex flex-col gap-1.5 text-sm leading-6 text-muted-foreground">
            <li>{getModelPrimaryHint(model, defaultGeneralModel?.id)}</li>
            <li>
              {isDefaultGeneralModel
                ? "当前就是默认通用模型，适合首次使用和主路径演示。"
                : <><span translate="no">{getModelDisplayName(defaultGeneralModel)}</span> 更适合作为默认入口，不确定时优先回到它。</>}
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <span>适合场景</span>
            <InfoHint
              label="适合场景"
              content="这里用最短的两条建议说明当前模型适合承接什么任务，不再堆叠大段解释。"
              mode="popover"
              align="start"
            />
          </div>
          <ul className="flex flex-col gap-2 text-sm leading-6 text-muted-foreground">
            {(model.recommendedUseCases?.length ? model.recommendedUseCases : model.capabilitySummary)
              .slice(0, 2)
              .map((item) => (
                <li key={item} className="flex gap-3">
                  <ArrowRightIcon className="mt-1 size-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
          </ul>
        </div>

        <div className="space-y-1 text-xs leading-5 text-muted-foreground">
          {model.providerId === "mock" ? (
            <>
              <p>当前模式：本地兜底演示</p>
              <p>真实服务暂时不可用时，界面仍能完整走通主流程。</p>
            </>
          ) : (
            <p>
              协议：{model.apiFormat || "unknown"} · Provider：{model.providerId} · 流式输出：
              {model.supportsStreaming ? "支持" : "未标记"}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
