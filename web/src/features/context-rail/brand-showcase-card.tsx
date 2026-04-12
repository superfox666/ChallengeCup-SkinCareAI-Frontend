import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { brandShowcaseSrc } from "@/lib/brand-assets"

export function BrandShowcaseCard() {
  return (
    <Card className="app-surface app-panel-surface rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(16,29,54,0.96),rgba(11,19,35,0.9))] py-0 text-white shadow-[0_24px_60px_rgba(0,0,0,0.18)]">
      <div className="relative h-52 overflow-hidden">
        <img
          src={brandShowcaseSrc}
          alt="SkinCareAI 品牌展示素材"
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,13,24,0)_8%,rgba(6,13,24,0.68)_100%)]" />
      </div>
      <CardHeader>
        <CardTitle className="text-xl">品牌展示卡</CardTitle>
        <CardDescription className="text-sm leading-7 text-slate-300">
          使用既有品牌素材，保持比赛展示中的视觉识别连续性。
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-5 text-sm leading-7 text-slate-300">
        当前版本聚焦主问诊流程，不在右侧扩展社区、资讯或复杂信息流。
      </CardContent>
    </Card>
  )
}
