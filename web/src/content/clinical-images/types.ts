export type ClinicalImageDisease =
  | "acne"
  | "eczema"
  | "dermatitis"
  | "urticaria"
  | "dry-skin"
  | "psoriasis"
  | "fungal"
  | "rosacea"
  | "folliculitis"

export interface ClinicalImageSourceRegistryEntry {
  id: string
  name: string
  sourceType: "official-public-health" | "official-medical" | "reference-only"
  url: string
  allowed: boolean
  copyrightStatus:
    | "unknown"
    | "requires-review"
    | "approved-for-demo"
    | "reference-only"
    | "restricted"
  usageScope:
    | "placeholder-only"
    | "knowledge-page-only"
    | "future-analysis-candidate"
    | "future-manifest-candidate"
    | "reference-only"
    | "blocked"
  checkedBy: string
  checkedAt: string
  updatedAt: string
  notes: string
}

export interface ClinicalImageMeta {
  id: string
  disease: ClinicalImageDisease
  title: string
  sourceId: string
  source: string
  sourceUrl: string
  usagePermissionNote: string
  bodyPart: string
  severity: "mild" | "moderate" | "severe" | "unknown"
  displayNote: string
  summary: string
  path: string | null
  status: "placeholder" | "approved"
  placeholder: boolean
  tags: string[]
  copyrightStatus: "unknown" | "requires-review" | "approved-for-demo"
  usageScope: "placeholder-only" | "knowledge-page-only" | "future-analysis-candidate"
  relatedKnowledgeEntryIds: string[]
  updatedAt: string
}
