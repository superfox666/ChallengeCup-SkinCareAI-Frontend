import { useMemo, useState } from "react"
import { BookOpenTextIcon, ShieldAlertIcon } from "lucide-react"

import {
  featuredKnowledgeEntries,
  knowledgeCategories,
  knowledgeCategoryLabels,
  knowledgeEntries,
} from "@/content/knowledge"
import type { KnowledgeCategory } from "@/content/knowledge/types"
import { Button } from "@/components/ui/button"
import { KnowledgeCard } from "@/features/knowledge/knowledge-card"

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

  return (
    <section className="mx-auto flex min-h-[calc(100svh-2rem)] w-full max-w-[1680px] flex-col gap-5 px-4 py-4 lg:px-5 2xl:px-6">
      <section className="app-surface app-panel-surface flex flex-col gap-4 rounded-[30px] border border-white/8 bg-[linear-gradient(180deg,rgba(16,29,54,0.96),rgba(11,19,35,0.9))] px-5 py-5 lg:px-7 lg:py-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex max-w-3xl flex-col gap-3">
            <span className="text-[0.72rem] font-medium uppercase tracking-[0.32em] text-primary/80">
              SkinCareAI Knowledge
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight text-white">皮肤科普静态卡片</h1>
              <BookOpenTextIcon className="size-6 text-primary" />
            </div>
            <p className="max-w-4xl text-base leading-8 text-slate-300">
              第一版仅使用保守白名单文本整理后的静态卡片，不接搜索、不接 RAG、不展示来源引用卡片。
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant={activeView === "featured" ? "default" : "outline"}
            className="rounded-2xl border-white/12 bg-white/6 text-slate-100 hover:bg-white/8"
            onClick={() => setActiveView("featured")}
          >
            精选内容 · {featuredKnowledgeEntries.length}
          </Button>
          <Button
            type="button"
            variant={activeView === "all" ? "default" : "outline"}
            className="rounded-2xl border-white/12 bg-white/6 text-slate-100 hover:bg-white/8"
            onClick={() => setActiveView("all")}
          >
            全部内容 · {knowledgeEntries.length}
          </Button>
        </div>
        <p className="text-sm leading-7 text-slate-400">
          {activeView === "featured"
            ? "精选内容聚焦比赛展示最容易理解、最适合投屏阅读的知识条目。"
            : "全部内容展示当前本地知识包中的全部可见条目，按分类浏览。"}
        </p>
        {activeView === "featured" ? (
          <div className="app-surface rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm leading-7 text-slate-300">
            精选内容优先保留更高频、更容易被普通用户理解、且更适合展示当前项目定位的知识条目。
          </div>
        ) : null}
        {activeView === "all" ? (
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={activeCategory === "all" ? "default" : "outline"}
              className="rounded-2xl border-white/12 bg-white/6 text-slate-100 hover:bg-white/8"
              onClick={() => setActiveCategory("all")}
            >
              全部分类
            </Button>
            {knowledgeCategories.map((category) => (
              <Button
                key={category.id}
                type="button"
                variant={activeCategory === category.id ? "default" : "outline"}
              className="rounded-2xl border-white/12 bg-white/6 text-slate-100 hover:bg-white/8"
              onClick={() => setActiveCategory(category.id)}
            >
              {knowledgeCategoryLabels[category.id]} · {categoryCounts[category.id]}
            </Button>
          ))}
        </div>
        ) : null}
      </section>

      {activeView === "featured" ? (
        <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {filteredCards.map((item) => (
            <KnowledgeCard key={item.id} item={item} />
          ))}
        </section>
      ) : activeCategory === "all" ? (
        <section className="flex flex-col gap-6">
          {groupedCards.map((group) => (
            <section
              key={group.category.id}
              className="app-surface app-panel-surface rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(16,29,54,0.88),rgba(11,19,35,0.82))] px-4 py-4 lg:px-5 lg:py-5"
            >
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl font-semibold text-white">
                    {knowledgeCategoryLabels[group.category.id]}
                  </h2>
                  <p className="text-sm leading-7 text-slate-400">
                    当前分类共 {group.items.length} 条，可作为后续检索和问答辅助的本地内容基础。
                  </p>
                </div>
                <div className="text-xs text-slate-500">按 displayOrder 排序</div>
              </div>
              <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                {group.items.map((item) => (
                  <KnowledgeCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          ))}
        </section>
      ) : (
        <section className="flex flex-col gap-4">
          <div className="app-surface flex items-center justify-between gap-3 rounded-[22px] border border-white/8 bg-white/5 px-4 py-3">
            <div>
              <h2 className="text-lg font-semibold text-white">
                {knowledgeCategoryLabels[activeCategory]}
              </h2>
              <p className="text-sm leading-7 text-slate-400">
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

      <section className="app-surface app-panel-surface rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(16,29,54,0.96),rgba(11,19,35,0.9))] px-5 py-5 text-slate-300 lg:px-6">
        <div className="flex items-center gap-2 text-white">
          <ShieldAlertIcon className="size-5 text-primary" />
          <h2 className="text-lg font-semibold">使用说明</h2>
        </div>
        <div className="mt-3 space-y-2 text-sm leading-7">
          <p>当前页面内容来自本地知识文本的前端清洗版，只保留适合静态展示的基础知识点。</p>
          <p>原始知识文本中的测试残留、重复内容和明显脏数据已被排除在静态版之外。</p>
          <p>“精选内容”用于比赛展示与投屏阅读，“全部内容”用于浏览完整本地知识条目。</p>
          <p>若后续接入检索或更完整知识体系，应先继续做数据清洗与来源审核。</p>
        </div>
      </section>
    </section>
  )
}
