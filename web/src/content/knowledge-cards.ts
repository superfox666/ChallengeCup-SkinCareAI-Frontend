export type KnowledgeCategory = "tcm" | "western" | "integrated"

export interface KnowledgeCardData {
  id: string
  category: KnowledgeCategory
  title: string
  summary: string
  keyPoints: string[]
  safetyNote: string
  sourceLabel: string
}

export const knowledgeCategoryLabels: Record<KnowledgeCategory, string> = {
  tcm: "中医皮肤基础",
  western: "西医常见问题",
  integrated: "中西医结合方案",
}

export const knowledgeCards: KnowledgeCardData[] = [
  {
    id: "tcm-overview",
    category: "tcm",
    title: "整体观念",
    summary: "中医强调皮肤问题与脏腑、气血、生活方式之间的整体联系。",
    keyPoints: [
      "皮肤变化常被视为内部失衡的外在表现。",
      "护理与调理需要结合作息、饮食和体质判断。",
      "第一版仅展示基础理念，不替代辨证施治。",
    ],
    safetyNote: "若症状持续或明显加重，仍应线下面诊。",
    sourceLabel: "中医皮肤科 / 基础理论.txt（清洗后）",
  },
  {
    id: "tcm-wind",
    category: "tcm",
    title: "风证要点",
    summary: "风证常见于发作快、游走性强、瘙痒明显的皮肤表现。",
    keyPoints: [
      "常见联想问题包括荨麻疹和皮肤瘙痒症。",
      "常见思路是祛风止痒，但应结合具体诱因判断。",
      "需要区分短期刺激反应与反复发作的慢性问题。",
    ],
    safetyNote: "伴随呼吸困难或全身过敏症状时应立即就医。",
    sourceLabel: "中医皮肤科 / 基础理论.txt（清洗后）",
  },
  {
    id: "tcm-damp-heat",
    category: "tcm",
    title: "湿证与热证",
    summary: "湿证偏渗出缠绵，热证偏红肿灼热，两者常影响护理节奏。",
    keyPoints: [
      "湿证常见于湿疹、皮炎等反复渗出问题。",
      "热证常见于痤疮、毛囊炎等红肿炎症表现。",
      "护理上通常优先减少刺激，避免频繁叠加活性产品。",
    ],
    safetyNote: "渗液、破溃或感染迹象明显时需及时就医。",
    sourceLabel: "中医皮肤科 / 基础理论.txt（清洗后）",
  },
  {
    id: "western-acne",
    category: "western",
    title: "痤疮基础认知",
    summary: "痤疮属于毛囊皮脂腺单位的慢性炎症问题，分级会影响处理方式。",
    keyPoints: [
      "轻度以粉刺为主，中重度则更偏炎性丘疹或结节囊肿。",
      "基础处理思路包括温和清洁、规范外用和必要时就医。",
      "不建议自行频繁刷酸或叠加刺激性产品。",
    ],
    safetyNote: "结节囊肿、瘢痕风险高或久治不缓解时应面诊。",
    sourceLabel: "西医皮肤科 / 1.txt（清洗后）",
  },
  {
    id: "western-eczema",
    category: "western",
    title: "湿疹基础认知",
    summary: "湿疹常表现为红斑、丘疹、水疱、糜烂、渗出和结痂等多阶段变化。",
    keyPoints: [
      "诱因可能来自环境、过敏、屏障受损或刺激性接触。",
      "第一步往往是停用刺激源，优先做保湿修复。",
      "症状急性加重时需要专业判断是否使用药物。",
    ],
    safetyNote: "大面积渗出、严重瘙痒或反复发作时需就医。",
    sourceLabel: "西医皮肤科 / 1.txt（清洗后）",
  },
  {
    id: "integrated-acne",
    category: "integrated",
    title: "痤疮中西医结合方案",
    summary: "痤疮可以采用西医控炎为主、中医调理为辅的联合思路。",
    keyPoints: [
      "西医方向偏向外用维A酸等常规方案。",
      "中医方向偏向清热凉血、活血化瘀等调理思路。",
      "联合方案重在节奏稳定，不建议自行频繁换方案。",
    ],
    safetyNote: "口服药和外用药都需要结合医生建议使用。",
    sourceLabel: "中西医结合 / 综合治疗.txt（清洗后）",
  },
  {
    id: "integrated-eczema",
    category: "integrated",
    title: "湿疹中西医结合方案",
    summary: "湿疹常按急性期和慢性期分阶段处理，中医与西医可分工协同。",
    keyPoints: [
      "急性期以控制炎症和渗出为先。",
      "慢性期更强调修复屏障与长期调理。",
      "联合策略的重点是减少反复，不追求短期刺激性见效。",
    ],
    safetyNote: "若长期反复或伴继发感染，需及时面诊评估。",
    sourceLabel: "中西医结合 / 综合治疗.txt（清洗后）",
  },
]
