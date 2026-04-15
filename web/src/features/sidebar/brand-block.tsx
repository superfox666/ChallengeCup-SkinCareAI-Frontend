import { brandAiAvatarSrc } from "@/lib/brand-assets"

export function BrandBlock() {
  return (
    <div className="surface-brand app-surface relative overflow-hidden rounded-[24px] border border-border/70 px-4 py-3.5 shadow-[var(--surface-shadow-soft)]">
      <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-24 bg-[radial-gradient(circle_at_center,rgba(38,198,190,0.14),transparent_72%)]" />

      <div className="relative flex items-center gap-3">
        <div className="relative flex size-12 items-center justify-center rounded-[18px] border border-border/60 bg-background/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <div className="flex size-9 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_35%,rgba(255,255,255,0.98),rgba(232,246,247,0.92))] shadow-[0_10px_24px_rgba(4,14,24,0.18)] ring-1 ring-white/30">
            <img
              src={brandAiAvatarSrc}
              alt="SkinCareAI 品牌头像"
              className="size-7 object-contain"
            />
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="text-[0.68rem] font-medium uppercase tracking-[0.34em] text-primary/80">
            SkinCareAI
          </span>
          <h1 className="text-[1.3rem] leading-[1.05] font-semibold tracking-tight text-foreground">
            中西医皮肤智能问诊
          </h1>
          <p className="max-w-[16rem] text-sm leading-6 text-muted-foreground">
            面向演示与验收的皮肤健康咨询工作台
          </p>
          <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-foreground/90">
            <span className="rounded-full border border-border/70 bg-background/55 px-2 py-1">图文问诊</span>
            <span className="rounded-full border border-border/70 bg-background/55 px-2 py-1">默认入口更省心</span>
          </div>
        </div>
      </div>
    </div>
  )
}
