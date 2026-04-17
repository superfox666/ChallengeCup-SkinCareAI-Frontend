import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { brandShowcaseSrc } from "@/lib/brand-assets"

export function BrandShowcaseCard() {
  return (
    <Card className="surface-panel app-surface overflow-hidden rounded-[26px] border border-border/70 py-0 text-foreground shadow-[var(--surface-shadow-soft)]">
      <div className="relative flex items-center gap-3 border-b border-border/60 bg-[radial-gradient(circle_at_right_top,rgba(38,198,190,0.16),transparent_68%)] px-4 py-4">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-[20px] border border-border/70 bg-background/75 shadow-[var(--surface-shadow-soft)]">
          <img
            src={brandShowcaseSrc}
            alt="SkinCareAI 品牌展示素材"
            className="size-12 object-contain"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="min-w-0">
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-primary/85">
            展示导向
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">右侧只留当前任务真正需要的信息</p>
        </div>
      </div>
      <CardHeader className="space-y-1 pb-2">
        <CardTitle className="text-sm text-foreground sm:text-base">当前演示说明</CardTitle>
        <CardDescription className="text-sm leading-6 text-muted-foreground">
          右侧区域只服务当前模型、当前规则和当前步骤，不再长期堆解释性大卡片。
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4 pt-0 text-sm leading-6 text-muted-foreground">
        先看当前任务信息，再决定要不要展开更多说明，避免把主聊天区和模型区一起挤小。
      </CardContent>
    </Card>
  )
}
