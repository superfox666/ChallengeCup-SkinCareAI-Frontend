export type KnowledgeCategory = "tcm" | "western" | "integrated"
export type KnowledgeReviewStatus = "draft" | "reviewed" | "approved"

export interface KnowledgeEntry {
  id: string
  sourceId: string
  name: string
  slug: string
  category: KnowledgeCategory
  summary: string
  symptoms: string[]
  careAdvice: string[]
  redFlags: string[]
  whenToSeeDoctor: string[]
  triageAdvice: string
  displayOrder: number
  featured: boolean
  visible: boolean
  aliases: string[]
  searchKeywords: string[]
  relatedImageIds?: string[]
  source: string
  sourceUrl: string
  updatedAt: string
  reviewStatus: KnowledgeReviewStatus
}

export interface KnowledgeCategoryDefinition {
  id: KnowledgeCategory
  label: string
  displayOrder: number
  visible: boolean
}

export interface KnowledgeSourceRegistryEntry {
  id: string
  name: string
  sourceType:
    | "local-curated"
    | "official-medical"
    | "official-public-health"
    | "teaching-resource"
    | "reference-only"
  url: string
  allowed: boolean
  copyrightStatus:
    | "unknown"
    | "internal-curated"
    | "public-reference-only"
    | "restricted"
    | "requires-review"
  usageScope:
    | "knowledge-page-only"
    | "internal-reference-only"
    | "future-retrieval-candidate"
    | "blocked"
  checkedBy: string
  checkedAt: string
  updatedAt: string
  notes: string
}
