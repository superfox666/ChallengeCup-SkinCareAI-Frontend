import { ShieldAlertIcon } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InfoHint } from "@/components/ui/info-hint"

export function DisclaimerCard() {
  return (
    <Card className="surface-panel-muted rounded-[28px] border border-border/70 text-foreground shadow-[var(--surface-shadow-soft)]">
      <CardHeader className="space-y-1.5 pb-2">
        <div className="flex items-center gap-2">
          <ShieldAlertIcon className="size-5 text-primary" />
          <CardTitle>使用说明</CardTitle>
          <InfoHint
            label="使用说明"
            mode="popover"
            align="start"
            content={[
              "1. 当前版本以演示交互闭环为主，不替代真实临床诊断。",
              "2. 仅供皮肤健康咨询与科普参考，不替代面诊、检查和处方。",
              "3. 如持续恶化、渗液、感染或明显疼痛，请及时线下就医。",
              "4. 如果模型返回空白、乱码或与皮肤无关的内容，优先重试一次，再考虑切换模型。",
            ].join("\n")}
          />
        </div>
        <CardDescription className="text-sm leading-6 text-muted-foreground">
          当前版本以演示交互闭环为主，不替代真实临床诊断。
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4 text-sm leading-6 text-muted-foreground">
        <ul className="flex flex-col gap-1.5">
          <li>仅供皮肤健康咨询与科普参考。</li>
          <li>不替代面诊、检查和处方。</li>
          <li>如持续恶化、渗液、感染或明显疼痛，请及时线下就医。</li>
        </ul>
      </CardContent>
    </Card>
  )
}
