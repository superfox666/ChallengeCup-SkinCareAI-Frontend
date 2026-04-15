import {
  BadgeAlertIcon,
  LeafIcon,
  ScaleIcon,
  ShieldAlertIcon,
  SparklesIcon,
  StethoscopeIcon,
} from "lucide-react"

import type { KnowledgeEntry } from "@/content/knowledge/types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { knowledgeCategoryLabels } from "@/content/knowledge"

interface KnowledgeCardProps {
  item: KnowledgeEntry
}

const categoryVisuals = {
  tcm: {
    icon: LeafIcon,
    accent: "text-emerald-500",
  },
  western: {
    icon: StethoscopeIcon,
    accent: "text-sky-500",
  },
  integrated: {
    icon: ScaleIcon,
    accent: "text-primary",
  },
} as const

export function KnowledgeCard({ item }: KnowledgeCardProps) {
  const reviewStatusLabel =
    item.reviewStatus === "approved"
      ? "已通过"
      : item.reviewStatus === "reviewed"
        ? "已审"
        : "草稿"

  const Icon = categoryVisuals[item.category].icon
  const riskItems = [...item.redFlags, ...item.whenToSeeDoctor].slice(0, 2)
  const quickCarePoint = item.careAdvice[0] ?? item.triageAdvice
  const quickRiskPoint = riskItems[0] ?? item.triageAdvice

  return (
    <Card className="surface-panel app-surface rounded-[30px] border border-border/70 text-foreground shadow-[var(--surface-shadow-soft)]">
      <CardHeader className="space-y-2.5 sm:space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="h-7 rounded-full border-border/70 bg-background/75 px-2.5 text-foreground"
              >
                <Icon data-icon="inline-start" className={categoryVisuals[item.category].accent} />
                {knowledgeCategoryLabels[item.category]}
              </Badge>
              <Badge
                variant="outline"
                className="h-7 rounded-full border-border/70 bg-background/75 px-2.5 text-muted-foreground"
              >
                {reviewStatusLabel}
              </Badge>
            </div>
            <div>
              <CardTitle className="text-[1.08rem] leading-[1.18] sm:text-[1.24rem]">{item.name}</CardTitle>
              <CardDescription className="mt-2 overflow-hidden text-sm leading-6 text-muted-foreground [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] sm:block sm:leading-7">
                {item.summary}
              </CardDescription>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:hidden">
          <div className="rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-xs text-foreground">
            症状线索 {item.symptoms.length}
          </div>
          <div className="rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-xs text-foreground">
            护理建议 {item.careAdvice.length}
          </div>
          <div className="rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-xs text-foreground">
            风险提示 {item.redFlags.length + item.whenToSeeDoctor.length}
          </div>
        </div>

        <div className="hidden gap-2 sm:grid sm:grid-cols-3">
          <div className="rounded-[20px] border border-border/70 bg-background/65 px-3 py-3">
            <div className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">症状线索</div>
            <div className="mt-2 text-lg font-semibold text-foreground">{item.symptoms.length}</div>
          </div>
          <div className="rounded-[20px] border border-border/70 bg-background/65 px-3 py-3">
            <div className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">护理建议</div>
            <div className="mt-2 text-lg font-semibold text-foreground">{item.careAdvice.length}</div>
          </div>
          <div className="rounded-[20px] border border-border/70 bg-background/65 px-3 py-3">
            <div className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">风险提示</div>
            <div className="mt-2 text-lg font-semibold text-foreground">{item.redFlags.length + item.whenToSeeDoctor.length}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-4 sm:space-y-4 sm:pb-5">
        <div className="space-y-3 sm:hidden">
          <section className="rounded-[18px] border border-border/70 bg-background/65 p-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <SparklesIcon className="size-4 text-primary" />
              护理建议
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{quickCarePoint}</p>
          </section>

          <section className="rounded-[18px] border border-primary/18 bg-primary/8 p-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <ShieldAlertIcon className="size-4 text-primary" />
              风险提示
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{quickRiskPoint}</p>
          </section>

          <details className="rounded-[18px] border border-border/70 bg-background/65 p-3">
            <summary className="cursor-pointer list-none text-sm font-medium text-foreground">
              展开更多护理与来源
            </summary>
            <div className="mt-3 space-y-3 text-sm leading-6 text-muted-foreground">
              <ul className="flex flex-col gap-2">
                {item.careAdvice.slice(1, 3).map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="mt-2 size-1.5 rounded-full bg-primary" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-border/70 pt-3 text-xs text-muted-foreground">
                <div className="text-[11px] uppercase tracking-[0.24em]">来源信息</div>
                <div className="mt-1 truncate">{item.source}</div>
                <div className="mt-1">{item.updatedAt}</div>
              </div>
            </div>
          </details>
        </div>

        <div className="hidden space-y-4 sm:block">
          <section className="rounded-[22px] border border-border/70 bg-background/65 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <SparklesIcon className="size-4 text-primary" />
              护理建议
            </div>
            <ul className="mt-3 flex flex-col gap-3 text-sm leading-7 text-muted-foreground">
              {item.careAdvice.slice(0, 2).map((point) => (
                <li key={point} className="flex gap-3">
                  <span className="mt-2 size-1.5 rounded-full bg-primary" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-[22px] border border-primary/18 bg-primary/8 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <ShieldAlertIcon className="size-4 text-primary" />
              风险提示
            </div>
            <div className="mt-3 flex flex-col gap-3 text-sm leading-7 text-muted-foreground">
              {riskItems.length > 0 ? (
                riskItems.map((point) => (
                  <div key={point} className="flex gap-3">
                    <BadgeAlertIcon className="mt-1 size-4 shrink-0 text-primary" />
                    <span>{point}</span>
                  </div>
                ))
              ) : (
                <p>{item.triageAdvice}</p>
              )}
            </div>
          </section>

          <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">来源信息</div>
              <span className="mt-1 block truncate">{item.source}</span>
            </div>
            <span className="shrink-0">{item.updatedAt}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
