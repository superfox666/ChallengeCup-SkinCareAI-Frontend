import type { KnowledgeEntry } from "@/content/knowledge/types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { knowledgeCategoryLabels } from "@/content/knowledge"

interface KnowledgeCardProps {
  item: KnowledgeEntry
}

export function KnowledgeCard({ item }: KnowledgeCardProps) {
  const reviewStatusLabel =
    item.reviewStatus === "approved"
      ? "已通过"
      : item.reviewStatus === "reviewed"
        ? "已审"
        : "草稿"

  return (
    <Card className="app-surface app-panel-surface rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(16,29,54,0.96),rgba(11,19,35,0.9))] text-white shadow-[0_24px_60px_rgba(0,0,0,0.14)]">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-[1.2rem] leading-[1.2]">{item.name}</CardTitle>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Badge variant="outline" className="border-white/12 bg-white/6 text-slate-200">
              {knowledgeCategoryLabels[item.category]}
            </Badge>
            <Badge
              variant="outline"
              className={[
                "border-white/12 bg-white/6 text-slate-200",
                item.reviewStatus === "draft" ? "text-amber-200" : "",
              ].join(" ")}
            >
              {reviewStatusLabel}
            </Badge>
          </div>
        </div>
        <CardDescription className="text-sm leading-8 text-slate-300">
          {item.summary}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pb-5">
        <ul className="flex flex-col gap-3.5 text-sm leading-8 text-slate-300">
          {item.careAdvice.map((point) => (
            <li key={point} className="flex gap-3">
              <span className="mt-2 size-1.5 rounded-full bg-primary" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
        <div className="rounded-2xl border border-primary/18 bg-primary/8 px-4 py-3 text-sm text-slate-200">
          {item.triageAdvice}
        </div>
        <div className="flex items-center justify-between gap-3 text-xs text-slate-400">
          <span className="truncate">{item.source}</span>
          <span>{item.updatedAt}</span>
        </div>
      </CardContent>
    </Card>
  )
}
