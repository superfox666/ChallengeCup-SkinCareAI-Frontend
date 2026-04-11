import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ModelDefinition } from "@/types/chat"

interface ModelCapabilityCardProps {
  model: ModelDefinition
}

export function ModelCapabilityCard({ model }: ModelCapabilityCardProps) {
  return (
    <Card className="rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(16,29,54,0.96),rgba(11,19,35,0.9))] text-white shadow-[0_24px_60px_rgba(0,0,0,0.18)]">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>当前模型能力</CardTitle>
          <Badge variant="outline" className="border-white/12 bg-white/6 text-slate-100">
            {model.sessionType === "vision" ? "图片问诊" : "文本问诊"}
          </Badge>
        </div>
        <CardDescription className="text-slate-300">
          {model.name} · {model.summary}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-5">
        <ul className="flex flex-col gap-3 text-sm leading-7 text-slate-300">
          {model.capabilitySummary.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-2 size-1.5 rounded-full bg-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
