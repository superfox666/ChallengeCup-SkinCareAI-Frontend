import { useMemo, useState } from "react"
import {
  BookOpenTextIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  FolderOpenIcon,
  ImagesIcon,
  LeafIcon,
  ScaleIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StethoscopeIcon,
} from "lucide-react"

import { clinicalImageManifest } from "@/content/clinical-images/manifest"
import type { ClinicalImageDisease } from "@/content/clinical-images/types"
import {
  featuredKnowledgeEntries,
  knowledgeEntries,
} from "@/content/knowledge"
import type { KnowledgeCategory, KnowledgeEntry } from "@/content/knowledge/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { InfoHint } from "@/components/ui/info-hint"
import { ScrollArea } from "@/components/ui/scroll-area"
import { KnowledgeCard } from "@/features/knowledge/knowledge-card"

const categoryVisuals = {
  tcm: {
    icon: LeafIcon,
    label: "中医基础",
    description: "偏体质、辨证和日常调护思路。",
    accent: "text-emerald-500",
  },
  western: {
    icon: StethoscopeIcon,
    label: "西医常见问题",
    description: "偏症状、风险识别和护理建议。",
    accent: "text-sky-500",
  },
  integrated: {
    icon: ScaleIcon,
    label: "中西医结合",
    description: "把两套视角合并成更适合展示的结论。",
    accent: "text-primary",
  },
} as const

const guideItems = [
  { title: "先看最可能", description: "先判断最可能的问题，再决定是否继续展开阅读。" },
  { title: "再看护理", description: "优先保留可执行动作，减少演示时停顿。" },
  { title: "最后看风险", description: "危险信号优先于所有护理细节。" },
]

const clinicalDemoPlan: Array<{
  id: string
  label: string
  diseases: ClinicalImageDisease[]
  target: string
  directory: string
}> = [
  {
    id: "acne",
    label: "痤疮",
    diseases: ["acne"],
    target: "2 到 3 张",
    directory: "public/clinical-images/demo/acne",
  },
  {
    id: "eczema-dermatitis",
    label: "湿疹 / 皮炎",
    diseases: ["eczema", "dermatitis"],
    target: "2 到 3 张",
    directory: "public/clinical-images/demo/eczema-dermatitis",
  },
  {
    id: "fungal",
    label: "真菌感染",
    diseases: ["fungal"],
    target: "2 到 3 张",
    directory: "public/clinical-images/demo/fungal",
  },
  {
    id: "psoriasis",
    label: "银屑病",
    diseases: ["psoriasis"],
    target: "2 到 3 张",
    directory: "public/clinical-images/demo/psoriasis",
  },
]

export function KnowledgePage() {
  const [activeView, setActiveView] = useState<"featured" | "all">("all")
  const [activeCategory, setActiveCategory] = useState<KnowledgeCategory | "all">("all")
  const [isGuideExpanded, setIsGuideExpanded] = useState(false)
  const [isClinicalDemoExpanded, setIsClinicalDemoExpanded] = useState(false)

  const featuredCount = featuredKnowledgeEntries.length

  const categoryCounts = useMemo(
    () =>
      Object.fromEntries(
        (Object.keys(categoryVisuals) as KnowledgeCategory[]).map((category) => [
          category,
          knowledgeEntries.filter((item) => item.category === category).length,
        ])
      ) as Record<KnowledgeCategory, number>,
    []
  )

  const filteredCards = useMemo(() => {
    const baseEntries =
      activeView === "featured" ? featuredKnowledgeEntries : knowledgeEntries

    if (activeCategory === "all") {
      return baseEntries
    }

    return baseEntries.filter((item) => item.category === activeCategory)
  }, [activeCategory, activeView])

  const clinicalDemoCards = useMemo(
    () =>
      clinicalDemoPlan.map((plan) => {
        const matchedEntries = clinicalImageManifest.filter((item) =>
          plan.diseases.includes(item.disease)
        )
        const approvedEntries = matchedEntries.filter(
          (item) => item.status === "approved" && item.path
        )
        const relatedKnowledgeCount = new Set(
          matchedEntries.flatMap((item) => item.relatedKnowledgeEntryIds)
        ).size

        return {
          ...plan,
          currentCount: approvedEntries.length,
          source: approvedEntries[0]?.source ?? "来源审核中",
          updatedAt: approvedEntries[0]?.updatedAt ?? "更新整理中",
          relatedKnowledgeCount,
          hasApprovedAssets: approvedEntries.length > 0,
        }
      }),
    []
  )

  const selectedCategoryMeta =
    activeCategory === "all" ? null : categoryVisuals[activeCategory]

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-hidden px-1 py-1 lg:gap-3 lg:px-2">
      <section className="surface-hero app-surface shrink-0 rounded-[26px] border border-border/70 px-3.5 py-3 shadow-[var(--surface-shadow-strong)] lg:px-4">
        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_210px]">
          <div className="flex max-w-4xl flex-col gap-2">
            <span className="text-[0.7rem] font-medium uppercase tracking-[0.32em] text-primary/80">
              SkinCareAI Knowledge
            </span>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-[1.28rem] font-semibold tracking-tight text-foreground lg:text-[1.5rem]">
                皮肤科普知识导览
              </h1>
              <BookOpenTextIcon className="size-4.5 text-primary" />
              <InfoHint
                label="知识页导览"
                content="这里恢复展示完整知识条目，首屏只压缩导览区，不再删减知识卡片数量。"
                align="start"
              />
            </div>
            <p className="max-w-4xl text-sm leading-6 text-muted-foreground">
              现在默认展示完整知识条目，导览、阅读提示和病例图说明都改成更紧凑的按需展开。
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant={activeView === "all" ? "default" : "outline"}
                className="h-8 rounded-full px-4"
                onClick={() => setActiveView("all")}
              >
                全部内容 · {knowledgeEntries.length}
              </Button>
              <Button
                type="button"
                variant={activeView === "featured" ? "default" : "outline"}
                className="h-8 rounded-full border-border/70 bg-background/70 px-4 text-foreground hover:bg-muted"
                onClick={() => setActiveView("featured")}
              >
                精选内容 · {featuredCount}
              </Button>
            </div>
          </div>

          <div className="hidden gap-2 xl:grid">
            <div className="surface-panel-muted rounded-[18px] border border-border/70 px-3 py-2.5">
              <div className="text-[11px] uppercase tracking-[0.24em] text-primary/75">当前规则</div>
              <div className="mt-1 text-sm leading-5 text-foreground">
                保留完整卡片，压缩说明区，不再牺牲条目数量。
              </div>
            </div>
            <div className="surface-panel-muted rounded-[18px] border border-border/70 px-3 py-2.5">
              <div className="text-[11px] uppercase tracking-[0.24em] text-primary/75">阅读方式</div>
              <div className="mt-1 text-sm leading-5 text-foreground">
                先看最可能，再看护理，最后看风险。
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            type="button"
            variant={activeCategory === "all" ? "default" : "outline"}
            className="h-8 rounded-full border-border/70 bg-background/70 px-4 text-foreground hover:bg-muted"
            onClick={() => setActiveCategory("all")}
          >
            全部分类
          </Button>
          {(Object.keys(categoryVisuals) as KnowledgeCategory[]).map((category) => {
            const Icon = categoryVisuals[category].icon

            return (
              <Button
                key={category}
                type="button"
                variant={activeCategory === category ? "default" : "outline"}
                className="h-8 rounded-full border-border/70 bg-background/70 px-4 text-foreground hover:bg-muted"
                onClick={() => setActiveCategory(category)}
              >
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Icon className={categoryVisuals[category].accent} />
                  {categoryVisuals[category].label} · {categoryCounts[category]}
                </div>
              </Button>
            )
          })}
        </div>
      </section>

      <ScrollArea className="min-h-0 flex-1 pr-1">
        <div className="flex flex-col gap-3 pb-5">
          <section className="surface-panel-muted rounded-[20px] border border-border/70 px-3.5 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {guideItems.map((item) => (
                  <Badge
                    key={item.title}
                    variant="outline"
                    className="h-7 rounded-full border-border/70 bg-background/70 px-2.5 text-foreground"
                  >
                    <SparklesIcon data-icon="inline-start" className="size-3.5 text-primary" />
                    {item.title}
                  </Badge>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                className="h-8 rounded-full border-border/70 bg-background/70 px-3 text-xs text-foreground hover:bg-muted"
                onClick={() => setIsGuideExpanded((current) => !current)}
              >
                {isGuideExpanded ? <ChevronUpIcon className="size-4" /> : <ChevronDownIcon className="size-4" />}
                {isGuideExpanded ? "收起阅读提示" : "展开阅读提示"}
              </Button>
            </div>

            {isGuideExpanded ? (
              <div className="mt-3 grid gap-3 lg:grid-cols-3">
                {guideItems.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[18px] border border-border/70 bg-background/60 px-3.5 py-3"
                  >
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <SparklesIcon className="size-4 text-primary" />
                      {item.title}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-xs leading-6 text-muted-foreground">
                默认把首屏面积优先让给主知识卡片；需要讲解流程时再展开详细阅读提示。
              </p>
            )}
          </section>

          <section className="surface-panel app-surface rounded-[24px] border border-border/70 px-4 py-3.5 shadow-[var(--surface-shadow-soft)]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold tracking-tight text-foreground">病例图演示集</h2>
                  <InfoHint
                    label="病例图演示集"
                    content="这里只展示正式演示目录和已审核样例说明，未完成内容统一收纳为“样例整理中”。"
                    align="start"
                  />
                </div>
                <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                  默认只展示覆盖病种、样例数量和审核状态，不再把大块说明长期压在首屏。
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="h-7 rounded-full border-primary/25 bg-primary/10 px-2.5 text-primary"
                >
                  <ImagesIcon data-icon="inline-start" />
                  4 类病种
                </Badge>
                <Badge
                  variant="outline"
                  className="h-7 rounded-full border-border/70 bg-background/70 px-2.5 text-muted-foreground"
                >
                  已接入样例 {clinicalDemoCards.reduce((sum, item) => sum + item.currentCount, 0)} 张
                </Badge>
                <Button
                  type="button"
                  variant="outline"
                  className="h-7 rounded-full border-border/70 bg-background/70 px-3 text-xs text-foreground hover:bg-muted"
                  onClick={() => setIsClinicalDemoExpanded((current) => !current)}
                >
                  {isClinicalDemoExpanded ? <ChevronUpIcon className="size-4" /> : <ChevronDownIcon className="size-4" />}
                  {isClinicalDemoExpanded ? "收起明细" : "展开明细"}
                </Button>
              </div>
            </div>

            {isClinicalDemoExpanded ? (
              <div className="mt-4 grid gap-3 lg:grid-cols-2 xl:grid-cols-4">
                {clinicalDemoCards.map((item) => (
                  <div
                    key={item.id}
                    className="surface-panel-muted rounded-[20px] border border-border/70 px-4 py-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium text-foreground">{item.label}</div>
                        <div className="mt-1 text-xs text-muted-foreground">目标 {item.target}</div>
                      </div>
                      <Badge
                        variant="outline"
                        className={cnDemoBadge(item.hasApprovedAssets)}
                      >
                        <ShieldCheckIcon data-icon="inline-start" className="size-3.5" />
                        {item.hasApprovedAssets ? "已接入样例" : "样例整理中"}
                      </Badge>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 text-xs">
                      <div className="rounded-full border border-border/70 bg-background/65 px-3 py-1.5 text-foreground">
                        已接入 {item.currentCount}
                      </div>
                      <div className="rounded-full border border-border/70 bg-background/65 px-3 py-1.5 text-foreground">
                        关联知识 {item.relatedKnowledgeCount}
                      </div>
                    </div>

                    <div className="mt-4 space-y-2 text-sm leading-6 text-muted-foreground">
                      <div className="flex items-center gap-2 text-foreground">
                        <FolderOpenIcon className="size-4 text-primary" />
                        正式目录
                      </div>
                      <p className="font-mono text-[11px] leading-5 text-muted-foreground">{item.directory}</p>
                      <p>来源：{item.source}</p>
                      <p>更新：{item.updatedAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-3 flex flex-col gap-3">
                <p className="text-sm leading-6 text-muted-foreground">
                  默认只保留覆盖病种、样例数量和审核状态，把首屏空间优先留给主知识卡片。
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  {clinicalDemoCards.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-full border border-border/70 bg-background/65 px-3 py-1.5 text-foreground"
                    >
                      {item.label} · 已接入 {item.currentCount} · {item.hasApprovedAssets ? "已接入样例" : "样例整理中"}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {selectedCategoryMeta ? (
            <section className="surface-panel app-surface flex items-center justify-between gap-3 rounded-[22px] border border-border/70 px-4 py-3 shadow-[var(--surface-shadow-soft)]">
              <div>
                <h2 className="text-base font-semibold text-foreground">{selectedCategoryMeta.label}</h2>
                <p className="text-sm leading-6 text-muted-foreground">{selectedCategoryMeta.description}</p>
              </div>
              <div className="text-xs text-muted-foreground">{filteredCards.length} 条内容</div>
            </section>
          ) : null}

          <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {filteredCards.map((item: KnowledgeEntry) => (
              <KnowledgeCard key={item.id} item={item} />
            ))}
          </section>

          <section className="surface-panel-muted rounded-[22px] border border-border/70 px-4 py-3.5">
            <div className="flex items-center gap-2 text-foreground">
              <ShieldAlertIcon className="size-5 text-primary" />
              <h2 className="text-base font-semibold">使用说明</h2>
            </div>
            <div className="mt-3 grid gap-2.5 lg:grid-cols-2">
              <div className="rounded-[18px] border border-border/70 bg-background/60 px-4 py-3 text-sm leading-6 text-muted-foreground">
                当前知识页承担结构化科普展示，不再通过删减条目来换取首屏空间。
              </div>
              <div className="rounded-[18px] border border-border/70 bg-background/60 px-4 py-3 text-sm leading-6 text-muted-foreground">
                病例图演示集只展示已审核样例和正式目录说明，其余素材继续在审核流程内整理。
              </div>
            </div>
          </section>
        </div>
      </ScrollArea>
    </section>
  )
}

function cnDemoBadge(hasApprovedAssets: boolean) {
  return [
    "h-6 rounded-full px-2",
    hasApprovedAssets
      ? "border-primary/25 bg-primary/10 text-primary"
      : "border-border/70 bg-background/70 text-muted-foreground",
  ].join(" ")
}
