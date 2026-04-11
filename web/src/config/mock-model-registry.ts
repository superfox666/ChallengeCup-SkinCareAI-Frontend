import type { ModelDefinition } from "@/types/chat"

export const mockModelRegistry: ModelDefinition[] = [
  {
    id: "skin-text-core",
    providerId: "mock",
    name: "Skin Core",
    summary: "基础皮肤问诊与护理建议",
    sessionType: "text",
    supportsImageInput: false,
    supportsMarkdown: true,
    status: "available",
    capabilitySummary: [
      "适合日常皮肤问题咨询",
      "输出中西医结合的结构化建议",
      "不支持直接图片分析",
    ],
  },
  {
    id: "skin-text-clinical",
    providerId: "mock",
    name: "Clinical Notes",
    summary: "更偏专业表达的文本问诊模型",
    sessionType: "text",
    supportsImageInput: false,
    supportsMarkdown: true,
    status: "available",
    capabilitySummary: [
      "适合偏专业的描述整理",
      "强调风险提醒与护理步骤",
      "不支持直接图片分析",
    ],
  },
  {
    id: "skin-vision-insight",
    providerId: "mock",
    name: "Vision Insight",
    summary: "支持皮肤图片与文字联合分析",
    sessionType: "vision",
    supportsImageInput: true,
    supportsMarkdown: true,
    status: "available",
    capabilitySummary: [
      "支持单图 + 文字联合输入",
      "给出初步观察点与追问建议",
      "适合作为图片问诊新会话入口",
    ],
    recommendedForImageHandoff: true,
  },
]

export const defaultModelId = mockModelRegistry[0].id

export function getModelById(modelId: string) {
  return mockModelRegistry.find((model) => model.id === modelId)
}

export function getRecommendedVisionModel() {
  return (
    mockModelRegistry.find((model) => model.recommendedForImageHandoff) ??
    mockModelRegistry.find((model) => model.supportsImageInput) ??
    mockModelRegistry[0]
  )
}
