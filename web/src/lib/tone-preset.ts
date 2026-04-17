export type TonePreset = "professional" | "plain" | "comfort" | "playful"

export const tonePresetOptions: Array<{
  id: TonePreset
  label: string
  shortLabel: string
  description: string
  instruction: string
}> = [
  {
    id: "professional",
    label: "专业严谨",
    shortLabel: "专业",
    description: "优先风险识别、医学边界和结构化建议。",
    instruction:
      "本轮回答必须采用专业、谨慎、结构化的表达。优先说明风险识别、判断依据和可执行建议，避免夸大结论，不使用玩笑化表达。",
  },
  {
    id: "plain",
    label: "通俗解释",
    shortLabel: "通俗",
    description: "少术语、讲人话，强调为什么和怎么做。",
    instruction:
      "本轮回答必须像对普通用户解释一样，尽量少用术语、少用抽象判断，多用白话说明为什么会这样以及接下来应该怎么做。",
  },
  {
    id: "comfort",
    label: "安抚陪伴",
    shortLabel: "安抚",
    description: "语气更温和，先安抚再给建议。",
    instruction:
      "本轮回答必须先安抚情绪，再给建议。在保持医学谨慎前提下使用更温和、陪伴式的语气，但仍要保留清晰的风险提示。",
  },
  {
    id: "playful",
    label: "魔性整活",
    shortLabel: "整活",
    description: "允许轻微玩梗，但不能损害医学边界。",
    instruction:
      "本轮回答必须在不损害医学边界和风险提示的前提下，加入一句轻松比喻、俏皮说法或轻微玩梗，让表达更有记忆点；但不能油腻、不能轻佻、不能削弱风险提示。",
  },
]

const tonePresetMap = Object.fromEntries(
  tonePresetOptions.map((option) => [option.id, option])
) as Record<TonePreset, (typeof tonePresetOptions)[number]>

export function getTonePresetLabel(tonePreset: TonePreset) {
  return tonePresetMap[tonePreset].label
}

export function getTonePresetShortLabel(tonePreset: TonePreset) {
  return tonePresetMap[tonePreset].shortLabel
}

export function getTonePresetInstruction(tonePreset: TonePreset) {
  return tonePresetMap[tonePreset].instruction
}

export function buildToneInjectedText(userText: string, tonePreset: TonePreset) {
  const normalized = userText.trim()
  const toneInstruction = getTonePresetInstruction(tonePreset)
  const normalizedBody = normalized || "请结合当前图片和上下文做结构化分析。"

  return [
    "[隐藏风格指令，仅对本轮回答生效，优先级高于默认表达偏好]",
    toneInstruction,
    "",
    "[用户原始问题]",
    normalizedBody,
  ].join("\n")
}
