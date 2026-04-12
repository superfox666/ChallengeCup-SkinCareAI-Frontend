import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function DisclaimerCard() {
  return (
    <Card className="app-surface app-panel-surface rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(16,29,54,0.96),rgba(11,19,35,0.9))] text-white shadow-[0_24px_60px_rgba(0,0,0,0.18)]">
      <CardHeader>
        <CardTitle>免责声明</CardTitle>
        <CardDescription className="text-slate-300">
          Batch 1 只验证交互闭环和架构规则，不替代真实临床判断。
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-5 text-sm leading-7 text-slate-300">
        <div className="flex flex-col gap-3">
          <p>仅供皮肤健康咨询与科普参考，不替代医生面诊、检查和处方。</p>
          <p>图片问诊已接入真实模型路由，具体效果仍受当前模型状态与网络情况影响。</p>
          <p>若出现持续恶化、渗液、感染或强烈不适，请及时线下就医。</p>
        </div>
      </CardContent>
    </Card>
  )
}
