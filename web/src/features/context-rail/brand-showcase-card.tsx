import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { brandShowcaseSrc } from "@/lib/brand-assets"

export function BrandShowcaseCard() {
  return (
    <Card className="surface-panel app-surface overflow-hidden rounded-[26px] border border-border/70 py-0 text-foreground shadow-[var(--surface-shadow-soft)]">
      <div className="relative h-16 overflow-hidden">
        <img
          src={brandShowcaseSrc}
          alt="SkinCareAI 品牌展示素材"
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,13,24,0.08)_10%,rgba(6,13,24,0.52)_100%)]" />
        <div className="absolute inset-x-3 bottom-2 rounded-[14px] border border-white/15 bg-black/30 px-2.5 py-1.5 text-white backdrop-blur-sm">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-primary/85">展示导向</p>
          <p className="mt-0.5 text-xs font-semibold sm:text-sm">右栏只留当前要讲的重点</p>
        </div>
      </div>
      <CardHeader className="space-y-1.5 pb-2">
        <CardTitle className="text-sm text-foreground sm:text-base">当前演示说明</CardTitle>
        <CardDescription className="text-sm leading-6 text-muted-foreground">
          右侧只服务当前模型、当前规则和当前步骤。
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4 pt-0 text-sm leading-6 text-muted-foreground">
        先看当前任务信息，再决定是否继续看说明。
      </CardContent>
    </Card>
  )
}
