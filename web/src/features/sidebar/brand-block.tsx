import aiAvatar from "@/assets/brand/ai-avatar.png"

export function BrandBlock() {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(18,35,66,0.96),rgba(9,20,39,0.88))] px-5 py-5 shadow-[0_24px_60px_rgba(0,0,0,0.22)]">
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="flex items-center gap-4">
        <div className="relative flex size-16 items-center justify-center rounded-[22px] bg-white/10 ring-1 ring-white/12 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <div className="flex size-12 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_35%,rgba(255,255,255,0.98),rgba(232,246,247,0.92))] shadow-[0_12px_30px_rgba(4,14,24,0.22)] ring-1 ring-white/30">
            <img
              src={aiAvatar}
              alt="SkinCareAI 品牌头像"
              className="size-9 object-contain"
            />
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="text-[0.7rem] font-medium uppercase tracking-[0.36em] text-primary/80">
            SkinCareAI
          </span>
          <h1 className="text-[1.65rem] leading-[1.1] font-semibold tracking-tight text-white">
            中西医皮肤智能问诊
          </h1>
          <p className="max-w-[18rem] text-sm leading-6 text-slate-300">
            商业化展示取向的皮肤健康咨询工作台
          </p>
        </div>
      </div>
    </div>
  )
}
