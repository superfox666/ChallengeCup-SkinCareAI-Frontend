import { useMemo, useState } from "react"
import { BookOpenTextIcon, ShieldAlertIcon } from "lucide-react"

import { knowledgeCards, knowledgeCategoryLabels, type KnowledgeCategory } from "@/content/knowledge-cards"
import { Button } from "@/components/ui/button"
import { KnowledgeCard } from "@/features/knowledge/knowledge-card"
const categoryOrder: Array<KnowledgeCategory | "all"> = [
  "all",
  "tcm",
  "western",
  "integrated",
]

export function KnowledgePage() {
  const [activeCategory, setActiveCategory] = useState<KnowledgeCategory | "all">("all")

  const filteredCards = useMemo(() => {
    if (activeCategory === "all") {
      return knowledgeCards
    }

    return knowledgeCards.filter((item) => item.category === activeCategory)
  }, [activeCategory])

  return (
    <section className="mx-auto flex min-h-[calc(100svh-2rem)] w-full max-w-7xl flex-col gap-5 px-4 py-4 lg:px-5">
      <section className="flex flex-col gap-4 rounded-[30px] border border-white/8 bg-[linear-gradient(180deg,rgba(16,29,54,0.96),rgba(11,19,35,0.9))] px-5 py-5 lg:px-7 lg:py-6">
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
          {categoryOrder.map((category) => (
            <Button
              key={category}
              type="button"
              variant={activeCategory === category ? "default" : "outline"}
              className="rounded-2xl border-white/12 bg-white/6 text-slate-100 hover:bg-white/8"
              onClick={() => setActiveCategory(category)}
            >
              {category === "all" ? "全部内容" : knowledgeCategoryLabels[category]}
            </Button>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {filteredCards.map((item) => (
          <KnowledgeCard key={item.id} item={item} />
        ))}
      </section>

      <section className="rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(16,29,54,0.96),rgba(11,19,35,0.9))] px-5 py-5 text-slate-300 lg:px-6">
        <div className="flex items-center gap-2 text-white">
          <ShieldAlertIcon className="size-5 text-primary" />
          <h2 className="text-lg font-semibold">使用说明</h2>
        </div>
        <div className="mt-3 space-y-2 text-sm leading-7">
          <p>当前页面内容来自本地知识文本的前端清洗版，只保留适合静态展示的基础知识点。</p>
          <p>原始知识文本中的测试残留、重复内容和明显脏数据已被排除在静态版之外。</p>
          <p>若后续接入检索或更完整知识体系，应先继续做数据清洗与来源审核。</p>
        </div>
      </section>
    </section>
  )
}
