import { brandAiAvatarSrc } from "@/lib/brand-assets"

export function BrandBlock() {
  return (
    <div className="surface-brand app-surface relative overflow-hidden rounded-[24px] border border-border/70 px-3.5 py-3.5 shadow-[var(--surface-shadow-soft)]">
      <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="absolute -right-10 top-1/2 size-28 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(38,198,190,0.18),transparent_70%)]" />

      <div className="relative flex items-center gap-3">
        <div className="flex size-[4rem] shrink-0 items-center justify-center rounded-[22px] border border-border/60 bg-background/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <div className="flex size-[3rem] items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_35%,rgba(255,255,255,0.98),rgba(232,246,247,0.9))] shadow-[0_16px_30px_rgba(4,14,24,0.24)] ring-1 ring-white/25">
            <img
              src={brandAiAvatarSrc}
              alt="SkinCareAI 品牌图标"
              className="size-9 object-contain"
            />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p
            translate="no"
            className="text-[0.68rem] font-medium uppercase tracking-[0.34em] text-primary/80"
          >
            SkinCareAI
          </p>
          <h2 className="mt-1 text-[1.32rem] leading-[1.04] font-semibold tracking-tight text-foreground">
            中西医皮肤智能问诊
          </h2>
          <p className="mt-1.5 max-w-[18rem] text-xs leading-5 text-muted-foreground">
            高低频分区的皮肤问诊工作区，聊天留在主区，说明收进抽屉。
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5 text-[11px] text-foreground/90">
            <span className="rounded-full border border-border/70 bg-background/60 px-2.5 py-1">
              图文问诊
            </span>
            <span className="rounded-full border border-border/70 bg-background/60 px-2.5 py-1">
              切换模型新会话
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
