export type ClinicalImageDisease =
  | "acne"
  | "eczema"
  | "psoriasis"
  | "fungal"
  | "rosacea"
  | "folliculitis"

export interface ClinicalImageMeta {
  id: string
  disease: ClinicalImageDisease
  title: string
  source: string
  sourceUrl: string
  usagePermissionNote: string
  bodyPart: string
  severity: "mild" | "moderate" | "severe" | "unknown"
  displayNote: string
  summary: string
  path: string
}

export const clinicalImageManifest: ClinicalImageMeta[] = []

export const clinicalImageManifestExample: ClinicalImageMeta = {
  id: "acne_mild_face_01",
  disease: "acne",
  title: "面部轻度痤疮示例",
  source: "CDC PHIL",
  sourceUrl: "https://wwwn.cdc.gov/phil/default.aspx",
  usagePermissionNote:
    "仅在确认详情页版权状态允许公开演示后，才可从 raw 进入 approved 与 public 目录。",
  bodyPart: "face",
  severity: "mild",
  displayNote: "适合知识页和图片分析 mock 演示。",
  summary: "以粉刺和少量炎性丘疹为主的轻度痤疮示意。",
  path: "/clinical-images/acne/acne_mild_face_01.jpg",
}
