import { mockModelRegistry } from "@/config/mock-model-registry"
import type { AssistantTurnResult, ProviderRequest } from "@/types/chat"

import type { ProviderAdapter } from "@/lib/provider-adapter"

const concernLibrary = [
  {
    keywords: ["痘", "痤疮", "粉刺"],
    title: "痤疮样问题",
    advice: "先关注炎症程度、是否伴随疼痛和近期作息变化，护理上以温和清洁、减少频繁去角质为主。",
  },
  {
    keywords: ["湿疹", "发红", "瘙痒", "过敏"],
    title: "屏障受损或过敏样问题",
    advice: "建议先停用刺激性护肤品，观察是否伴随渗出、持续瘙痒或泛发性扩散，并尽量记录诱因。",
  },
  {
    keywords: ["干燥", "脱屑", "起皮"],
    title: "干燥脱屑样问题",
    advice: "优先判断是否因过度清洁、换季或外用药导致，护理上先补水保湿，减少复合活性叠加。",
  },
]

function detectConcern(input: string) {
  const normalized = input.toLowerCase()

  return (
    concernLibrary.find((item) =>
      item.keywords.some((keyword) => normalized.includes(keyword))
    ) ?? {
      title: "常规皮肤健康咨询",
      advice: "建议先明确症状持续时间、诱因、是否伴随刺痛或瘙痒，再决定护理和就医优先级。",
    }
  )
}

function buildTextResponse(input: ProviderRequest) {
  const question = input.input.text.trim() || "请结合当前会话给出结构化建议。"
  const concern = detectConcern(question)

  return [
    `### 初步判断`,
    `- 当前更接近 **${concern.title}** 的咨询场景。`,
    `- 你的问题已绑定到 **${input.model.name}** 会话，当前不会跨模型续写上下文。`,
    "",
    `### 中西医结合建议`,
    `- **西医方向**：先排查诱因、近期用药和屏障状态，必要时考虑线下面诊确认。`,
    `- **中医方向**：可从风热、湿热或血燥等角度做辨证思路，但仍需结合实际症状。`,
    `- **护理重点**：${concern.advice}`,
    "",
    `### 下一步建议`,
    `1. 补充症状持续时间、部位和是否反复发作。`,
    `2. 说明近期是否更换护肤品、药物或饮食作息。`,
    `3. 若出现明显加重、破溃或感染迹象，请及时就医。`,
    "",
    `> Batch 1 当前为 mock 回答，用于验证对话闭环和交互规则。`,
  ].join("\n")
}

function buildVisionResponse(input: ProviderRequest) {
  const question = input.input.text.trim() || "请基于图片做初步观察。"
  const imageName = input.input.image?.name ?? "本次上传图片"
  const concern = detectConcern(question)

  return [
    `### 图片初步观察`,
    `- 已切换到 **${input.model.name}** 图片问诊会话。`,
    `- 当前分析对象：**${imageName}**。`,
    `- 结合文字描述，更偏向 **${concern.title}** 的初步观察路径。`,
    "",
    `### 建议补充信息`,
    `- 说明拍摄部位、出现时间、是否伴随瘙痒或疼痛。`,
    `- 如近期使用了酸类、维A类或激素类产品，请一并补充。`,
    "",
    `### 护理提示`,
    `- 先避免自行叠加刺激性产品。`,
    `- 拍照时尽量保证自然光、清晰近景和单一部位。`,
    `- 若出现快速扩散、渗液或明显感染迹象，请尽快线下就医。`,
    "",
    `> Batch 1 当前仅模拟视觉模型响应，不连接真实图像理解能力。`,
  ].join("\n")
}

export const mockAdapter: ProviderAdapter = {
  id: "mock",
  async getModels() {
    return mockModelRegistry
  },
  async sendMessage(input: ProviderRequest): Promise<AssistantTurnResult> {
    const responseDelay = input.input.image ? 1400 : 900

    await new Promise((resolve) => window.setTimeout(resolve, responseDelay))

    return {
      text: input.model.supportsImageInput
        ? buildVisionResponse(input)
        : buildTextResponse(input),
    }
  },
}
