import { ShieldAlertIcon } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function DisclaimerCard() {
  return (
    <Card className="surface-panel app-surface rounded-[30px] border border-border/70 text-foreground shadow-[var(--surface-shadow-soft)]">
      <CardHeader className="space-y-2 pb-3">
        <div className="flex items-center gap-2">
          <ShieldAlertIcon className="size-5 text-primary" />
          <CardTitle>使用说明</CardTitle>
        </div>
        <CardDescription className="text-sm leading-6 text-muted-foreground">
          当前版本以展示交互闭环为主，不替代真实临床判断。
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4 text-sm leading-6 text-muted-foreground">
        <ul className="flex flex-col gap-2">
          <li>仅供皮肤健康咨询与科普参考。</li>
          <li>不替代面诊、检查和处方。</li>
          <li>如持续恶化、渗液、感染或强烈不适，请及时线下就医。</li>
        </ul>
      </CardContent>
    </Card>
  )
}
