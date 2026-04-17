import type { ModelDefinition } from "@/types/chat"

export type ModelCategory = "general" | "text" | "vision" | "reasoning" | "fast"

export const modelCategoryOrder: Array<{
  id: ModelCategory
  label: string
  description: string
}> = [
  {
    id: "general",
    label: "通用模型",
    description: "优先从这里开始。适合首次使用，也适合不确定该选哪一个模型时直接进入主流程。",
  },
  {
    id: "text",
    label: "文本模型",
    description: "更适合日常问答、护理建议、总结整理和结构化输出。",
  },
  {
    id: "vision",
    label: "图片模型",
    description: "更适合皮肤图片理解、图文联合提问和视觉分析。",
  },
  {
    id: "reasoning",
    label: "推理模型",
    description: "更适合复杂分析、多步判断和需要更强思考链路的问题。",
  },
  {
    id: "fast",
    label: "低成本快速",
    description: "更适合速度优先、频繁试用和成本敏感场景。",
  },
]

const DEFAULT_GENERAL_MODEL_IDS = [
  "qwen3-vl-flash",
  "gpt-5-all",
  "gpt-4o-all",
  "gpt-5.4-mini",
  "deepseek-v3.2",
  "claude-sonnet-4-6",
  "gpt-4.1",
  "grok-4.1",
  "grok-4-fast-reasoning",
  "grok-3",
  "skin-text-core",
  "skin-text-clinical",
  "skin-vision-insight",
] as const

const DEFAULT_VISION_MODEL_IDS = [
  "qwen3-vl-flash",
  "gpt-5-all",
  "gpt-4o-all",
  "claude-sonnet-4-6-vision",
  "qwen3-vl-plus",
  "qwen3-vl-30b-a3b-instruct",
  "qwen3-vl-32b-thinking",
  "skin-vision-insight",
] as const

const DEFAULT_REASONING_MODEL_IDS = [
  "deepseek-r1",
  "gpt-5.4",
  "claude-sonnet-4-6",
  "claude-opus-4-6-thinking",
  "grok-4-fast-reasoning",
  "skin-text-clinical",
] as const

const DEFAULT_BUDGET_MODEL_IDS = [
  "deepseek-chat",
  "gpt-5.4-nano",
  "gpt-5.4-mini",
  "qwen-plus-latest",
  "skin-text-core",
] as const

const PRIMARY_DEMO_MODEL_IDS = [
  "qwen3-vl-flash",
  "gpt-5-all",
  "gpt-5.4-mini",
  "deepseek-v3.2",
  "claude-sonnet-4-6",
  "gpt-4.1",
  "grok-4.1",
  "grok-4-fast-reasoning",
  "grok-3",
] as const

const DEPRIORITIZED_DEMO_MODEL_IDS = [
  "qwen-plus-latest",
  "claude-opus-4-6-thinking",
] as const

const statusWeight = {
  online: 4,
  degraded: 3,
  available: 2,
  unknown: 1,
  disabled: 0,
  offline: -1,
} as const

export function getEffectiveModelStatus(model?: ModelDefinition | null) {
  if (!model) {
    return "unknown" as const
  }

  if (model.status === "unknown" && model.available) {
    return "available" as const
  }

  return model.status
}

export function getModelDisplayName(model?: ModelDefinition | null) {
  if (!model) {
    return "未选择模型"
  }

  return model.displayName || model.name
}

export function getModelProviderLabel(model?: ModelDefinition | null) {
  const providerId = model?.providerId?.toLowerCase()

  if (providerId === "openai") return "OpenAI"
  if (providerId === "google") return "Gemini"
  if (providerId === "anthropic") return "Anthropic"
  if (providerId === "qwen") return "Qwen"
  if (providerId === "xai") return "xAI"
  if (providerId === "deepseek") return "DeepSeek"
  if (providerId === "kimi") return "Kimi"

  return model?.providerId || "Unknown"
}

export function getModelStatusLabel(
  status?: ModelDefinition["status"],
  available?: boolean
) {
  const resolvedStatus =
    status === "unknown" && available ? "available" : status ?? "unknown"

  if (resolvedStatus === "online") return "在线"
  if (resolvedStatus === "degraded") return "波动"
  if (resolvedStatus === "offline") return "离线"
  if (resolvedStatus === "disabled") return "停用"
  if (resolvedStatus === "available") return "可用 / 未测速"

  return "状态未知"
}

export function getModelSpeedMeta(speedLevel?: string) {
  if (speedLevel === "fast") {
    return {
      label: "响应快",
      shortLabel: "快",
      description: "适合连续追问、现场演示和轻量高频使用。",
    }
  }

  if (speedLevel === "slow") {
    return {
      label: "深度思考",
      shortLabel: "慢",
      description: "速度较慢，但更适合复杂任务和重点展示。",
    }
  }

  return {
    label: "均衡",
    shortLabel: "中",
    description: "速度和质量更均衡，适合作为常规使用选择。",
  }
}

export function getModelPriceMeta(priceLevel?: string) {
  if (priceLevel === "low") {
    return {
      label: "成本友好",
      shortLabel: "省",
      description: "适合频繁试用和成本敏感场景。",
    }
  }

  if (priceLevel === "high") {
    return {
      label: "成本较高",
      shortLabel: "高",
      description: "更适合重点展示和复杂任务。",
    }
  }

  return {
    label: "成本均衡",
    shortLabel: "中",
    description: "适合作为常规使用的成本档位。",
  }
}

export function getNetworkStrength(hint?: string) {
  if (!hint || hint.includes("待实测")) {
    return 1
  }

  if (hint.includes("国内")) {
    return 3
  }

  if (hint.includes("海外")) {
    return 2
  }

  return 2
}

export function getNetworkLabel(hint?: string) {
  if (!hint || hint.includes("待实测")) {
    return "待实测"
  }

  if (hint.includes("国内")) {
    return "国内链路更稳"
  }

  if (hint.includes("海外")) {
    return "海外链路更稳"
  }

  return hint
}

export function isReasoningModel(model: ModelDefinition) {
  const text = [
    ...(model.capabilities || []),
    ...(model.capabilitySummary || []),
    ...(model.recommendedUseCases || []),
    model.summary,
    model.description,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

  return (
    text.includes("推理") ||
    text.includes("思考") ||
    text.includes("复杂") ||
    text.includes("分析") ||
    model.id.includes("thinking") ||
    model.id.includes("-r1") ||
    model.id.includes("o3")
  )
}

export function isFastAffordableModel(model: ModelDefinition) {
  return model.speedLevel === "fast" || model.priceLevel === "low"
}

export function isDeprioritizedDemoModel(model: ModelDefinition) {
  return DEPRIORITIZED_DEMO_MODEL_IDS.includes(
    model.id as (typeof DEPRIORITIZED_DEMO_MODEL_IDS)[number]
  )
}

function pickDefaultModel(
  models: ModelDefinition[],
  preferredIds: readonly string[],
  predicate: (model: ModelDefinition) => boolean
) {
  const availableModels = models.filter(
    (model) => getEffectiveModelStatus(model) !== "offline" && predicate(model)
  )

  for (const modelId of preferredIds) {
    const matched = availableModels.find((model) => model.id === modelId)

    if (matched) {
      return matched
    }
  }

  return sortModelsByPriority(availableModels)[0] ?? null
}

export function getDefaultGeneralModel(models: ModelDefinition[]) {
  const availableModels = models.filter((model) => getEffectiveModelStatus(model) !== "offline")

  for (const modelId of DEFAULT_GENERAL_MODEL_IDS) {
    const matched = availableModels.find((model) => model.id === modelId)

    if (matched) {
      return matched
    }
  }

  return sortModelsByPriority(availableModels)[0] ?? sortModelsByPriority(models)[0] ?? null
}

export function getDefaultVisionModel(models: ModelDefinition[]) {
  return pickDefaultModel(models, DEFAULT_VISION_MODEL_IDS, (model) => model.supportsImageInput)
}

export function getDefaultReasoningModel(models: ModelDefinition[]) {
  return pickDefaultModel(models, DEFAULT_REASONING_MODEL_IDS, (model) => isReasoningModel(model))
}

export function getDefaultBudgetModel(models: ModelDefinition[]) {
  return pickDefaultModel(models, DEFAULT_BUDGET_MODEL_IDS, (model) => isFastAffordableModel(model))
}

export function isGeneralModel(model: ModelDefinition, models: ModelDefinition[]) {
  const defaultGeneralModel = getDefaultGeneralModel(models)

  if (defaultGeneralModel?.id === model.id) {
    return true
  }

  return PRIMARY_DEMO_MODEL_IDS.includes(model.id as (typeof PRIMARY_DEMO_MODEL_IDS)[number])
}

export function matchesModelCategory(
  model: ModelDefinition,
  category: ModelCategory,
  models: ModelDefinition[]
) {
  if (category === "general") return isGeneralModel(model, models)
  if (category === "text") return model.sessionType === "text" && !model.supportsImageInput
  if (category === "vision") return model.supportsImageInput
  if (category === "reasoning") return isReasoningModel(model)
  if (category === "fast") return isFastAffordableModel(model)

  return false
}

export function sortModelsByPriority(models: ModelDefinition[]) {
  return [...models].sort((left, right) => {
    const leftDefaultIndex = DEFAULT_GENERAL_MODEL_IDS.findIndex((modelId) => modelId === left.id)
    const rightDefaultIndex = DEFAULT_GENERAL_MODEL_IDS.findIndex((modelId) => modelId === right.id)

    if (leftDefaultIndex !== -1 || rightDefaultIndex !== -1) {
      if (leftDefaultIndex === -1) return 1
      if (rightDefaultIndex === -1) return -1
      if (leftDefaultIndex !== rightDefaultIndex) return leftDefaultIndex - rightDefaultIndex
    }

    if (isDeprioritizedDemoModel(left) !== isDeprioritizedDemoModel(right)) {
      return Number(isDeprioritizedDemoModel(left)) - Number(isDeprioritizedDemoModel(right))
    }

    const statusDiff =
      (statusWeight[getEffectiveModelStatus(right)] ?? 0) -
      (statusWeight[getEffectiveModelStatus(left)] ?? 0)
    if (statusDiff !== 0) return statusDiff

    const scoreDiff = (right.recommendedScore || 0) - (left.recommendedScore || 0)
    if (scoreDiff !== 0) return scoreDiff

    if (right.supportsImageInput !== left.supportsImageInput) {
      return Number(right.supportsImageInput) - Number(left.supportsImageInput)
    }

    return getModelDisplayName(left).localeCompare(getModelDisplayName(right), "zh-CN")
  })
}

export function getModelPrimaryHint(
  model: ModelDefinition,
  defaultGeneralModelId?: string | null
) {
  if (model.networkHint?.includes("需代理")) {
    if (model.supportsImageInput && isReasoningModel(model)) {
      return "适合图文联合分析；当前环境通常需要代理或更稳定的海外链路。"
    }

    if (model.supportsImageInput) {
      return "适合图片理解和图文问诊；当前环境通常需要代理或更稳定的海外链路。"
    }

    return "适合作为海外模型对照；当前环境通常需要代理或更稳定的海外链路。"
  }

  if (model.id === defaultGeneralModelId) {
    return "适合首次使用，文本和图片都能接住，不确定时优先从它开始。"
  }

  if (isDeprioritizedDemoModel(model)) {
    return "保留给特定对照或低频演示，不建议作为默认主入口。"
  }

  if (model.supportsImageInput && isReasoningModel(model)) {
    return "适合图文联合分析，也适合更复杂的视觉推理问题。"
  }

  if (model.supportsImageInput) {
    return "适合图片理解、图文联合问诊和单图演示。"
  }

  if (isReasoningModel(model)) {
    return "适合复杂分析、多步推理和重点展示场景。"
  }

  if (isFastAffordableModel(model)) {
    return "适合快速回复、高频试用和成本敏感场景。"
  }

  return "适合常规文本问答、护理建议和内容整理。"
}

export function getModelRoleLabel(
  model: ModelDefinition,
  defaultGeneralModelId?: string | null
) {
  if (model.id === defaultGeneralModelId) {
    return "默认通用模型"
  }

  if (isDeprioritizedDemoModel(model)) {
    return "保留备用"
  }

  if (model.supportsImageInput && isReasoningModel(model)) {
    return "图文推理"
  }

  if (model.supportsImageInput) {
    return "图片模型"
  }

  if (isReasoningModel(model)) {
    return "推理模型"
  }

  if (isFastAffordableModel(model)) {
    return "快速试用"
  }

  return "文本模型"
}

export function getModelCapabilityBadges(
  model: ModelDefinition,
  defaultGeneralModelId?: string | null
) {
  const items = [
    {
      id: "text",
      label: "文本",
      visible: true,
    },
    {
      id: "image",
      label: "图片",
      visible: model.supportsImageInput,
    },
    {
      id: "reasoning",
      label: "推理",
      visible: isReasoningModel(model),
    },
    {
      id: "default",
      label: "省心首选",
      visible: model.id === defaultGeneralModelId,
    },
  ]

  return items.filter((item) => item.visible)
}
