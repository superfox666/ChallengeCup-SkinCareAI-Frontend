import { useMemo, useState } from "react"
import {
  BookOpenTextIcon,
  FolderOpenIcon,
  ImagesIcon,
  LeafIcon,
  ScaleIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StethoscopeIcon,
} from "lucide-react"

import {
  featuredKnowledgeEntries,
  knowledgeCategories,
  knowledgeCategoryLabels,
  knowledgeEntries,
} from "@/content/knowledge"
import { clinicalImageManifest } from "@/content/clinical-images/manifest"
import type { ClinicalImageDisease } from "@/content/clinical-images/types"
import type { KnowledgeCategory } from "@/content/knowledge/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { InfoHint } from "@/components/ui/info-hint"
import { KnowledgeCard } from "@/features/knowledge/knowledge-card"

const categoryVisuals = {
  tcm: {
    icon: LeafIcon,
    description: "偏体质、辨证和日常调护思路。",
    accent: "text-emerald-500",
  },
  western: {
    icon: StethoscopeIcon,
    description: "偏症状、风险识别和护理建议。",
    accent: "text-sky-500",
  },
  integrated: {
    icon: ScaleIcon,
    description: "把中西医视角合并成更易展示的结构。",
    accent: "text-primary",
  },
} as const

const guideItems = [
  {
    title: "先看摘要",
    description: "先判断主题对不对，再决定要不要继续读。",
  },
  {
    title: "再看建议",
    description: "优先保留可执行建议，减少答辩时阅读停顿。",
  },
  {
    title: "最后看风险",
    description: "危险信号优先于所有护理细节。",
  },
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
] as const

export function KnowledgePage() {
  const [activeView, setActiveView] = useState<"featured" | "all">("featured")
  const [activeCategory, setActiveCategory] = useState<KnowledgeCategory | "all">("all")

  const categoryCounts = useMemo(
    () =>
      Object.fromEntries(
        knowledgeCategories.map((category) => [
          category.id,
          knowledgeEntries.filter((item) => item.category === category.id).length,
        ])
      ) as Record<KnowledgeCategory, number>,
    []
  )

  const filteredCards = useMemo(() => {
    if (activeView === "featured") {
      return featuredKnowledgeEntries
    }

    if (activeCategory === "all") {
      return knowledgeEntries
    }

    return knowledgeEntries.filter((item) => item.category === activeCategory)
  }, [activeCategory, activeView])

  const groupedCards = useMemo(() => {
    return knowledgeCategories
      .map((category) => ({
        category,
        items: knowledgeEntries.filter((item) => item.category === category.id),
      }))
      .filter((group) => group.items.length > 0)
  }, [])

  const clinicalDemoCards = useMemo(
    () =>
      clinicalDemoPlan.map((plan) => {
        const matchedEntries = clinicalImageManifest.filter((item) =>
          plan.diseases.includes(item.disease)
        )
        const approvedEntries = matchedEntries.filter((item) => item.status === "approved" && item.path)
        const relatedKnowledgeCount = new Set(
          matchedEntries.flatMap((item) => item.relatedKnowledgeEntryIds)
        ).size

        return {
          ...plan,
          currentCount: approvedEntries.length,
          pendingCount: matchedEntries.length - approvedEntries.length,
          source: approvedEntries[0]?.source ?? matchedEntries[0]?.source ?? "待补来源",
          updatedAt: approvedEntries[0]?.updatedAt ?? matchedEntries[0]?.updatedAt ?? "待更新",
          relatedKnowledgeCount,
          hasApprovedAssets: approvedEntries.length > 0,
        }
      }),
    []
  )

  return (
    <section className="mx-auto flex min-h-[calc(100svh-2rem)] w-full max-w-[1680px] flex-col gap-3 px-1 py-1 lg:gap-4 lg:px-2">
      <section className="surface-hero app-surface flex flex-col gap-3 rounded-[28px] border border-border/70 px-4 py-4 shadow-[var(--surface-shadow-strong)] lg:gap-4 lg:px-6 lg:py-5">
        <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="flex max-w-4xl flex-col gap-3">
            <span className="text-[0.72rem] font-medium uppercase tracking-[0.32em] text-primary/80">
              SkinCareAI Knowledge
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[2rem] font-semibold tracking-tight text-foreground lg:text-[2.3rem]">
                皮肤科普知识导览
              </h1>
              <BookOpenTextIcon className="size-5 text-primary" />
              <InfoHint
                label="知识页导览"
                content="这页只保留结构化知识卡片和病例图演示集，不接检索、不接 RAG，重点是让评委先扫读、再理解。"
                align="start"
              />
            </div>
            <p className="max-w-4xl text-sm leading-6 text-muted-foreground sm:leading-7">
              <span className="sm:hidden">只保留适合展示的知识卡片，先扫读，再决定是否展开。</span>
              <span className="hidden sm:inline">
                当前版本只保留适合展示的知识卡片，重点不是信息量，而是阅读节奏和讲解效率。
              </span>
            </p>

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant={activeView === "featured" ? "default" : "outline"}
                className="h-9 rounded-full px-4"
                onClick={() => {
                  setActiveView("featured")
                  setActiveCategory("all")
                }}
              >
                精选内容 · {featuredKnowledgeEntries.length}
              </Button>
              <Button
                type="button"
                variant={activeView === "all" ? "default" : "outline"}
                className="h-9 rounded-full border-border/70 bg-background/70 px-4 text-foreground hover:bg-muted"
                onClick={() => setActiveView("all")}
              >
                全部内容 · {knowledgeEntries.length}
              </Button>
            </div>
          </div>

          <div className="hidden flex-wrap gap-2 md:flex 2xl:hidden">
            <div className="rounded-full border border-border/70 bg-background/75 px-3 py-1.5 text-xs text-foreground">
              只展示结构化知识包
            </div>
            <div className="rounded-full border border-border/70 bg-background/75 px-3 py-1.5 text-xs text-foreground">
              先看摘要，再看建议，最后看风险
            </div>
            <div className="rounded-full border border-border/70 bg-background/75 px-3 py-1.5 text-xs text-foreground">
              适合大屏讲解和静态浏览
            </div>
          </div>

          <div className="hidden gap-2 2xl:grid 2xl:grid-cols-1 2xl:overflow-visible">
            <div className="surface-panel-muted rounded-[22px] border border-border/70 px-4 py-3">
              <div className="text-[11px] uppercase tracking-[0.24em] text-primary/75">当前规则</div>
              <div className="mt-2 text-sm leading-7 text-foreground">只展示结构化知识包，不扩成检索系统。</div>
            </div>
            <div className="surface-panel-muted rounded-[22px] border border-border/70 px-4 py-3">
              <div className="text-[11px] uppercase tracking-[0.24em] text-primary/75">阅读方式</div>
              <div className="mt-2 text-sm leading-7 text-foreground">先看摘要，再看建议，最后看风险。</div>
            </div>
            <div className="surface-panel-muted rounded-[22px] border border-border/70 px-4 py-3">
              <div className="text-[11px] uppercase tracking-[0.24em] text-primary/75">展示用途</div>
              <div className="mt-2 text-sm leading-7 text-foreground">适合大屏讲解和静态浏览。</div>
            </div>
          </div>
        </div>

        <div className="hidden gap-3 lg:grid lg:grid-cols-3 lg:overflow-visible">
          {guideItems.map((item) => (
            <div
              key={item.title}
              className="surface-panel-muted min-w-[240px] rounded-[22px] border border-border/70 px-4 py-3 lg:min-w-0"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <SparklesIcon className="size-4 text-primary" />
                {item.title}
              </div>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>

        <section className="surface-panel app-surface rounded-[28px] border border-border/70 px-4 py-4 shadow-[var(--surface-shadow-soft)] lg:px-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">最小病例图演示集</h2>
                <InfoHint
                  label="病例图演示集"
                  content="当前已接入首批 CDC PHIL lores 演示图，并固定病种、目录、来源和知识关联；其余病种继续按来源审核后补齐。"
                  align="start"
                />
              </div>
              <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:leading-7">
                <span className="sm:hidden">重点不是“图库很多”，而是正式目录、manifest 和替换流程已经固定。</span>
                <span className="hidden sm:inline">
                  这里的重点不是“已经有大量真实图库”，而是“正式目录、manifest 和替换流程已经收死”。
                </span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="h-7 rounded-full border-primary/25 bg-primary/10 px-2.5 text-primary">
                <ImagesIcon data-icon="inline-start" />
                4 类病种
              </Badge>
              <Badge
                variant="outline"
                className="hidden h-7 rounded-full border-border/70 bg-background/70 px-2.5 text-muted-foreground sm:inline-flex"
              >
                已接入真实图 {clinicalDemoCards.reduce((sum, item) => sum + item.currentCount, 0)} 张
              </Badge>
            </div>
          </div>

          <div className="mt-4 flex gap-3 overflow-x-auto pb-1 lg:grid lg:grid-cols-2 xl:grid-cols-4 lg:overflow-visible">
            {clinicalDemoCards.map((item) => (
              <div
                key={item.id}
                className="surface-panel-muted min-w-[260px] rounded-[22px] border border-border/70 px-4 py-3 lg:min-w-0"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium text-foreground">{item.label}</div>
                    <div className="mt-1 text-xs text-muted-foreground">目标 {item.target}</div>
                  </div>
                  <Badge
                    variant="outline"
                    className={[
                      "h-6 rounded-full px-2",
                      item.hasApprovedAssets
                        ? "border-primary/25 bg-primary/10 text-primary"
                        : "border-border/70 bg-background/70 text-muted-foreground",
                    ].join(" ")}
                  >
                    <ShieldCheckIcon data-icon="inline-start" className="size-3.5" />
                    {item.hasApprovedAssets ? "已接入真实图" : "待补正式图"}
                  </Badge>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <div className="rounded-full border border-border/70 bg-background/65 px-3 py-1.5 text-foreground">
                    真实图 {item.currentCount}
                  </div>
                  <div className="rounded-full border border-border/70 bg-background/65 px-3 py-1.5 text-foreground">
                    关联知识 {item.relatedKnowledgeCount}
                  </div>
                  {item.pendingCount > 0 ? (
                    <div className="rounded-full border border-border/70 bg-background/65 px-3 py-1.5 text-muted-foreground">
                      待补 {item.pendingCount}
                    </div>
                  ) : null}
                </div>

                <div className="mt-4 space-y-2 text-sm leading-7 text-muted-foreground">
                  <div className="flex items-center gap-2 text-foreground">
                    <FolderOpenIcon className="size-4 text-primary" />
                    正式目录
                  </div>
                  <p className="font-mono text-[11px] leading-6 text-muted-foreground">{item.directory}</p>
                  <p>来源候选：{item.source}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 lg:hidden">
            <details className="surface-panel-muted rounded-[20px] border border-border/70 px-4 py-3 text-sm leading-6 text-muted-foreground">
              <summary className="cursor-pointer list-none font-medium text-foreground">
                展开演示说明与接入边界
              </summary>
              <div className="mt-3 space-y-3">
                <p>
                  当前可以在聊天页上传 demo 目录中的单张图片配合一句问题做图文问诊，这里只负责说明病种范围和接入状态。
                </p>
                <p>
                  正确讲法是：首批真实病例图已正式接入，剩余病种仍按来源审核和演示优先级继续补齐。
                </p>
              </div>
            </details>
          </div>

          <div className="mt-4 hidden gap-3 lg:grid lg:grid-cols-2">
            <div className="surface-panel-muted rounded-[22px] border border-border/70 px-4 py-3 text-sm leading-7 text-muted-foreground">
              <p className="font-medium text-foreground">怎么测试</p>
              <p className="mt-2">
                当前可以在聊天页上传 demo 目录中的单张图片配合一句问题做图文问诊，这里只负责说明病种范围和接入状态。
              </p>
            </div>
            <div className="surface-panel-muted rounded-[22px] border border-border/70 px-4 py-3 text-sm leading-7 text-muted-foreground">
              <p className="font-medium text-foreground">怎么讲</p>
              <p className="mt-2">
                正确讲法是：首批真实病例图已正式接入，剩余病种仍按来源审核和演示优先级继续补齐。
              </p>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant={activeView === "all" && activeCategory === "all" ? "default" : "outline"}
            className="h-10 rounded-full border-border/70 bg-background/70 px-4 py-0 text-left text-foreground hover:bg-muted sm:h-auto sm:rounded-[24px] sm:py-3"
            onClick={() => {
              setActiveView("all")
              setActiveCategory("all")
            }}
          >
            <div>
              <div className="text-sm font-medium">全部分类</div>
              <div className="hidden text-xs text-muted-foreground sm:block">一次浏览当前知识包</div>
            </div>
          </Button>
          {knowledgeCategories.map((category) => {
            const Icon = categoryVisuals[category.id].icon

            return (
              <Button
                key={category.id}
                type="button"
                variant={activeView === "all" && activeCategory === category.id ? "default" : "outline"}
                className="h-10 rounded-full border-border/70 bg-background/70 px-4 py-0 text-left text-foreground hover:bg-muted sm:h-auto sm:rounded-[24px] sm:py-3"
                onClick={() => {
                  setActiveView("all")
                  setActiveCategory(category.id)
                }}
              >
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Icon className={categoryVisuals[category.id].accent} />
                  {knowledgeCategoryLabels[category.id]} · {categoryCounts[category.id]}
                </div>
                <div className="mt-1 hidden text-xs leading-6 text-muted-foreground sm:block">
                  {categoryVisuals[category.id].description}
                </div>
              </Button>
            )
          })}
        </div>
      </section>

      {activeView === "featured" ? (
        <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {filteredCards.map((item, index) => (
            <div
              key={item.id}
              className={index >= 3 ? "hidden lg:block" : ""}
            >
              <KnowledgeCard item={item} />
            </div>
          ))}
          {filteredCards.length > 3 ? (
            <div className="surface-panel-muted rounded-[24px] border border-border/70 px-4 py-4 text-sm leading-7 text-muted-foreground lg:hidden">
              移动端默认只保留 3 张最值得讲的精选卡片，继续浏览请切到“全部内容”。
            </div>
          ) : null}
        </section>
      ) : activeCategory === "all" ? (
        <section className="flex flex-col gap-4 lg:gap-6">
          {groupedCards.map((group) => (
            <section
              key={group.category.id}
              className="surface-panel app-surface rounded-[28px] border border-border/70 px-4 py-4 shadow-[var(--surface-shadow-soft)] lg:px-5 lg:py-5"
            >
              <details className="group lg:hidden">
                <summary className="cursor-pointer list-none">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">
                        {knowledgeCategoryLabels[group.category.id]}
                      </h2>
                      <p className="text-sm leading-7 text-muted-foreground">
                        当前分类共 {group.items.length} 条
                      </p>
                    </div>
                    <Badge variant="outline" className="h-7 rounded-full border-border/70 bg-background/70 px-2.5 text-foreground">
                      展开
                    </Badge>
                  </div>
                </summary>
                <div className="mt-4 grid gap-4">
                  {group.items.map((item) => (
                    <KnowledgeCard key={item.id} item={item} />
                  ))}
                </div>
              </details>

              <div className="hidden lg:block">
                <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-semibold text-foreground">
                      {knowledgeCategoryLabels[group.category.id]}
                    </h2>
                    <p className="text-sm leading-7 text-muted-foreground">
                      当前分类共 {group.items.length} 条，可作为后续检索和问答辅助的本地内容基础。
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">按 displayOrder 排序</div>
                </div>
                <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                  {group.items.map((item) => (
                    <KnowledgeCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            </section>
          ))}
        </section>
      ) : (
        <section className="flex flex-col gap-4">
          <div className="surface-panel app-surface flex items-center justify-between gap-3 rounded-[24px] border border-border/70 px-4 py-3 shadow-[var(--surface-shadow-soft)]">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {knowledgeCategoryLabels[activeCategory]}
              </h2>
              <p className="text-sm leading-7 text-muted-foreground">
                当前分类共 {filteredCards.length} 条
              </p>
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {filteredCards.map((item) => (
              <KnowledgeCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      <section className="surface-panel app-surface rounded-[28px] border border-border/70 px-5 py-4 shadow-[var(--surface-shadow-soft)] lg:px-6">
        <div className="flex items-center gap-2 text-foreground">
          <ShieldAlertIcon className="size-5 text-primary" />
          <h2 className="text-lg font-semibold">使用说明</h2>
        </div>
        <details className="mt-3 rounded-[20px] border border-border/70 bg-background/55 px-4 py-3 text-sm leading-6 text-muted-foreground lg:hidden">
          <summary className="cursor-pointer list-none font-medium text-foreground">展开使用说明</summary>
          <div className="mt-3 space-y-3">
            <p>当前知识页来自本地结构化知识包的静态清洗版，支持展示，但仍需持续做来源审核和文本治理。</p>
            <p>病例图演示集已接入首批真实样例，当前以聊天页图片问诊演示和知识页来源说明为主，剩余病种继续按审核节奏补齐。</p>
          </div>
        </details>
        <div className="mt-3 hidden gap-3 lg:grid lg:grid-cols-2">
          <div className="surface-panel-muted rounded-[22px] border border-border/70 px-4 py-3 text-sm leading-7 text-muted-foreground">
            当前知识页来自本地结构化知识包的静态清洗版，支持展示，但仍需持续做来源审核和文本治理。
          </div>
          <div className="surface-panel-muted rounded-[22px] border border-border/70 px-4 py-3 text-sm leading-7 text-muted-foreground">
            病例图演示集已接入首批真实样例，当前以聊天页图片问诊演示和知识页来源说明为主，剩余病种继续按审核节奏补齐。
          </div>
        </div>
      </section>
    </section>
  )
}
