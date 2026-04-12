import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ModelDefinition } from "@/types/chat"

interface ModelCapabilityCardProps {
  model: ModelDefinition
}

export function ModelCapabilityCard({ model }: ModelCapabilityCardProps) {
  return (
    <Card className="app-surface app-panel-surface rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(16,29,54,0.96),rgba(11,19,35,0.9))] text-white shadow-[0_24px_60px_rgba(0,0,0,0.18)]">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>当前模型能力</CardTitle>
          <Badge variant="outline" className="border-white/12 bg-white/6 text-slate-100">
            {model.sessionType === "vision" ? "图片问诊" : "文本问诊"}
          </Badge>
        </div>
        <CardDescription className="text-slate-300">
          {(model.displayName || model.name)} · {model.summary}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-5">
        <div className="mb-4 flex flex-wrap gap-2 text-xs">
          <Badge variant="outline" className="border-white/12 bg-white/6 text-slate-100">
            {model.status === "online"
              ? "在线"
              : model.status === "degraded"
                ? "降级"
                : model.status === "offline"
                  ? "离线"
                  : "待检测"}
          </Badge>
          <Badge variant="outline" className="border-white/12 bg-white/6 text-slate-100">
            延迟 {model.latencyMs ? `${model.latencyMs} ms` : "--"}
          </Badge>
          <Badge variant="outline" className="border-white/12 bg-white/6 text-slate-100">
            速度 {model.speedLevel || "--"}
          </Badge>
          <Badge variant="outline" className="border-white/12 bg-white/6 text-slate-100">
            成本 {model.priceLevel || "--"}
          </Badge>
        </div>
        <ul className="flex flex-col gap-3 text-sm leading-7 text-slate-300">
          {(model.capabilitySummary || model.capabilities || []).map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-2 size-1.5 rounded-full bg-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1 text-xs leading-6 text-slate-400">
          <p>协议：{model.apiFormat || "unknown"} · provider：{model.providerId}</p>
          <p>网络提示：{model.networkHint || "待实测"}</p>
        </div>
      </CardContent>
    </Card>
  )
}
