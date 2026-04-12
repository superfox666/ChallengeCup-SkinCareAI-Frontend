import categories from "@/content/knowledge/indexes/categories.json"
import manifest from "@/content/knowledge/indexes/manifest.json"
import sourceRegistry from "@/content/knowledge/sources/source-registry.json"

import type {
  KnowledgeCategory,
  KnowledgeCategoryDefinition,
  KnowledgeEntry,
  KnowledgeSourceRegistryEntry,
} from "@/content/knowledge/types"

const entryModules = import.meta.glob("./entries/*.json", {
  eager: true,
  import: "default",
}) as Record<string, KnowledgeEntry>

const manifestEntries = manifest as Array<{ id: string; file: string }>

const entries = manifestEntries
  .map((item) => entryModules[`./${item.file}`])
  .filter(Boolean)

export const knowledgeSourceRegistry = sourceRegistry as KnowledgeSourceRegistryEntry[]
export const knowledgeCategories = (categories as KnowledgeCategoryDefinition[])
  .filter((item) => item.visible)
  .sort((left, right) => left.displayOrder - right.displayOrder)

export const knowledgeEntries = entries
  .filter((entry) => entry.visible)
  .sort((left, right) => left.displayOrder - right.displayOrder)

export const featuredKnowledgeEntries = knowledgeEntries.filter((entry) => entry.featured)

export const knowledgeCategoryLabels: Record<KnowledgeCategory, string> = Object.fromEntries(
  knowledgeCategories.map((item) => [item.id, item.label])
) as Record<KnowledgeCategory, string>
