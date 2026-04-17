import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  AlertTriangleIcon,
  BrainCircuitIcon,
  CheckCircle2Icon,
  ImageIcon,
  LoaderCircleIcon,
  MessageSquareTextIcon,
  ScaleIcon,
  SparklesIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { InfoHint } from "@/components/ui/info-hint"
import { mockAdapter } from "@/lib/mock-adapter"
import {
  getDefaultBudgetModel,
  getDefaultGeneralModel,
  getDefaultReasoningModel,
  getDefaultVisionModel,
  getModelDisplayName,
  getModelRoleLabel,
  isReasoningModel,
} from "@/lib/model-config"
import { serverAdapter } from "@/lib/server-adapter"
import type { ComposerPayload, Conversation, Message, ModelDefinition } from "@/types/chat"

interface ExpertConsultPanelProps {
  models: ModelDefinition[]
  currentModel: ModelDefinition
  messages: Message[]
  defaultGeneralModel?: ModelDefinition | null
}

interface ConsultResult {
  model: ModelDefinition
  role: "expert" | "judge"
  status: "idle" | "loading" | "success" | "error"
  text: string
  error?: string
}

function createVirtualConversation(model: ModelDefinition): Conversation {
  const timestamp = new Date().toISOString()

  return {
    id: `consult-${model.id}-${timestamp}`,
    title: "专家会诊",
    titleMode: "manual",
    modelId: model.id,
    providerId: model.providerId,
    sessionType: model.sessionType,
    status: "idle",
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}

function extractLatestUserPayload(messages: Message[]): ComposerPayload | null {
  const latestUserMessage = [...messages].reverse().find((message) => message.role === "user")

  if (!latestUserMessage) {
    return null
  }

  const text = latestUserMessage.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("\n\n")
  const imagePart = latestUserMessage.parts.find((part) => part.type === "image")

  return {
    text,
    image: imagePart?.type === "image" ? imagePart.image : null,
  }
}

function uniqModels(models: Array<ModelDefinition | null | undefined>) {
  return models.filter(Boolean).filter((model, index, collection) => {
    return collection.findIndex((candidate) => candidate?.id === model?.id) === index
  }) as ModelDefinition[]
}

function summarizeText(text: string, length = 140) {
  return text.replace(/\s+/g, " ").trim().slice(0, length)
}

async function runConsultRequest(model: ModelDefinition, payload: ComposerPayload) {
  const request = {
    conversation: createVirtualConversation(model),
    history: [] as Message[],
    model,
    input: payload,
  }

  try {
    const response = await serverAdapter.sendMessage(request)

    return {
      status: "success" as const,
      text: response.text,
    }
  } catch (error) {
    try {
      const fallback = await mockAdapter.sendMessage(request)

      return {
        status: "success" as const,
        text: fallback.text,
      }
    } catch {
      return {
        status: "error" as const,
        text: "",
        error: error instanceof Error ? error.message : "请求失败",
      }
    }
  }
}

function buildJudgePrompt(payload: ComposerPayload, expertResults: ConsultResult[]) {
  const expertSections = expertResults
    .filter((item) => item.status === "success")
    .map((item, index) => {
      return `专家 ${index + 1}（${getModelDisplayName(item.model)}）\n${item.text}`
    })
    .join("\n\n")

  return [
    "你现在是皮肤问诊会诊中的最终裁决者，请综合三位专家意见，给出最终结论。",
    "请按以下固定结构输出：",
    "1. 最可能结论排序",
    "2. 证据依据",
    "3. 专家意见一致点",
    "4. 专家意见冲突点",
    "5. 风险等级",
    "6. 推荐行动",
    "",
    `用户原始问题：${payload.text.trim() || "本轮主要基于图片问诊"}`,
    payload.image ? "当前请求附带皮肤图片，请结合图片信息判断。" : "当前请求没有附图，请只根据文本和专家意见判断。",
    "",
    "三位专家的完整意见如下：",
    expertSections || "暂无可用专家意见。",
  ].join("\n")
}

function buildJudgeFallback(expertResults: ConsultResult[]) {
  const successResults = expertResults.filter((item) => item.status === "success")

  if (successResults.length === 0) {
    return "裁决者暂时不可用，且本轮没有成功返回的专家意见。建议稍后重试。"
  }

  return [
    "最可能结论排序",
    successResults.map((item, index) => `${index + 1}. ${getModelDisplayName(item.model)}：${summarizeText(item.text, 80)}`).join("\n"),
    "",
    "证据依据",
    "当前为降级总结版，基于已返回的专家结论自动整理。",
    "",
    "专家意见一致点",
    "多位模型都围绕当前问题给出了护理建议和风险提示。",
    "",
    "专家意见冲突点",
    "不同模型对重点顺序和表达角度存在差异，建议结合主会话继续追问。",
    "",
    "风险等级",
    "待人工复核",
    "",
    "推荐行动",
    "优先查看三位专家卡片中的共识，再决定是否补充图片或症状细节。",
  ].join("\n")
}

export function ExpertConsultPanel({
  models,
  currentModel,
  messages,
  defaultGeneralModel,
}: ExpertConsultPanelProps) {
  const [expertResults, setExpertResults] = useState<ConsultResult[]>([])
  const [judgeResult, setJudgeResult] = useState<ConsultResult | null>(null)
  const [running, setRunning] = useState(false)
  const autoRunKeyRef = useRef<string | null>(null)
  const payload = useMemo(() => extractLatestUserPayload(messages), [messages])
  const defaultTextModel = useMemo(
    () => defaultGeneralModel ?? getDefaultGeneralModel(models),
    [defaultGeneralModel, models]
  )
  const defaultVisionModel = useMemo(() => getDefaultVisionModel(models), [models])
  const defaultReasoningModel = useMemo(() => getDefaultReasoningModel(models), [models])
  const defaultBudgetModel = useMemo(() => getDefaultBudgetModel(models), [models])

  const expertModels = useMemo(() => {
    if (!payload) {
      return []
    }

    const supplementModels = (
      baseModels: ModelDefinition[],
      predicate?: (model: ModelDefinition) => boolean
    ) => {
      if (baseModels.length >= 3) {
        return baseModels.slice(0, 3)
      }

      const extraModels = models.filter((candidate) => {
        if (baseModels.some((model) => model.id === candidate.id)) {
          return false
        }

        return predicate ? predicate(candidate) : true
      })

      return [...baseModels, ...extraModels].slice(0, 3)
    }

    if (payload.image) {
      const reasoningVisionModel =
        models.find((model) => model.supportsImageInput && isReasoningModel(model)) ?? null

      return supplementModels(
        uniqModels([
          defaultVisionModel,
          currentModel.supportsImageInput ? currentModel : null,
          reasoningVisionModel,
        ]),
        (model) => model.supportsImageInput
      )
    }

    return supplementModels(
      uniqModels([defaultTextModel, defaultReasoningModel, defaultBudgetModel, currentModel]),
      (model) => model.sessionType === "text"
    )
  }, [
    currentModel,
    defaultBudgetModel,
    defaultReasoningModel,
    defaultTextModel,
    defaultVisionModel,
    models,
    payload,
  ])

  const judgeModel = useMemo(() => {
    if (!payload) {
      return null
    }

    if (payload.image) {
      return (
        uniqModels([
          models.find((model) => model.supportsImageInput && isReasoningModel(model)) ?? null,
          defaultReasoningModel,
          currentModel,
          defaultVisionModel,
        ]).find((model) => !expertModels.some((expert) => expert.id === model.id)) ??
        uniqModels([defaultReasoningModel, currentModel, defaultVisionModel])[0] ??
        null
      )
    }

    return (
      uniqModels([defaultReasoningModel, currentModel, defaultTextModel]).find(
        (model) => !expertModels.some((expert) => expert.id === model.id)
      ) ??
      uniqModels([defaultReasoningModel, currentModel, defaultTextModel])[0] ??
      null
    )
  }, [
    currentModel,
    defaultReasoningModel,
    defaultTextModel,
    defaultVisionModel,
    expertModels,
    models,
    payload,
  ])

  const comparisonNote = useMemo(() => {
    const successResults = expertResults.filter((item) => item.status === "success")

    if (successResults.length < 2) {
      return "会诊完成后，这里会根据三位专家和裁决者的结果总结一致点与冲突点。"
    }

    const uniqueSummaries = new Set(successResults.map((item) => summarizeText(item.text, 90)))

    if (uniqueSummaries.size <= 1) {
      return "三位专家的整体结论接近，裁决者通常会给出更短、更适合演示的总结版本。"
    }

    return "当前专家之间存在表达和侧重点差异，建议重点比较风险判断、是否建议就医以及护理优先级。"
  }, [expertResults])

  const runConsult = useCallback(async () => {
    if (!payload || expertModels.length === 0 || !judgeModel || running) {
      return
    }

    setRunning(true)
    setExpertResults(
      expertModels.map((model) => ({
        model,
        role: "expert",
        status: "loading",
        text: "",
      }))
    )
    setJudgeResult({
      model: judgeModel,
      role: "judge",
      status: "idle",
      text: "",
    })

    const nextExpertResults = await Promise.all(
      expertModels.map(async (model) => {
        const result = await runConsultRequest(model, payload)

        return {
          model,
          role: "expert" as const,
          ...result,
        }
      })
    )

    setExpertResults(nextExpertResults)
    setJudgeResult({
      model: judgeModel,
      role: "judge",
      status: "loading",
      text: "",
    })

    const judgePayload: ComposerPayload = {
      text: buildJudgePrompt(payload, nextExpertResults),
      image: payload.image && judgeModel.supportsImageInput ? payload.image : null,
    }

    const nextJudgeResult = await runConsultRequest(judgeModel, judgePayload)

    setJudgeResult({
      model: judgeModel,
      role: "judge",
      status: nextJudgeResult.status,
      text:
        nextJudgeResult.status === "success"
          ? nextJudgeResult.text
          : buildJudgeFallback(nextExpertResults),
      error: nextJudgeResult.error,
    })
    setRunning(false)
  }, [expertModels, judgeModel, payload, running])

  const autoRunKey = useMemo(() => {
    if (!payload || expertModels.length === 0 || !judgeModel) {
      return null
    }

    return JSON.stringify({
      text: payload.text,
      imageId: payload.image?.id ?? null,
      expertIds: expertModels.map((model) => model.id),
      judgeId: judgeModel.id,
    })
  }, [expertModels, judgeModel, payload])

  useEffect(() => {
    if (!autoRunKey || running) {
      return
    }

    if (autoRunKeyRef.current === autoRunKey) {
      return
    }

    const timer = window.setTimeout(() => {
      if (autoRunKeyRef.current === autoRunKey) {
        return
      }

      autoRunKeyRef.current = autoRunKey
      void runConsult()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [autoRunKey, runConsult, running])

  return (
    <div className="flex flex-col gap-4">
      <div className="surface-panel rounded-[28px] border border-border/70 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold tracking-tight text-foreground">多专家会诊</h3>
              <InfoHint
                label="多专家会诊"
                content="这里不会影响主聊天链路。系统会并行拉起 3 位专家，再让 1 位裁决者汇总最终结论。"
                align="start"
              />
            </div>
            <p className="text-sm leading-7 text-muted-foreground">
              适合围绕同一个问题快速比较默认模型、推理模型和备用模型的判断差异，再生成一版更适合展示的最终裁决。
            </p>
          </div>
          <Button
            type="button"
            className="h-9 rounded-full px-4"
            onClick={() => void runConsult()}
            disabled={!payload || expertModels.length === 0 || !judgeModel || running}
          >
            {running ? (
              <>
                <LoaderCircleIcon data-icon="inline-start" className="animate-spin" />
                会诊中
              </>
            ) : (
              <>
                <MessageSquareTextIcon data-icon="inline-start" />
                重新会诊
              </>
            )}
          </Button>
        </div>

        <div className="mt-4 grid gap-3 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <div className="surface-panel-muted rounded-[24px] border border-border/70 px-4 py-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              {payload?.image ? <ImageIcon className="size-4 text-primary" /> : <SparklesIcon className="size-4 text-primary" />}
              当前问题
            </div>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              {payload
                ? payload.text.trim() || "当前会诊基于最新一条图片问诊请求。"
                : "当前会话里还没有可供发起会诊的用户问题。"}
            </p>
          </div>

          <div className="surface-panel-muted rounded-[24px] border border-border/70 px-4 py-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <BrainCircuitIcon className="size-4 text-primary" />
              会诊阵容
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {expertModels.map((model, index) => (
                <Badge
                  key={model.id}
                  variant="outline"
                  className="h-7 rounded-full border-border/70 bg-background/70 px-2.5 text-foreground"
                >
                  专家 {index + 1} · {getModelDisplayName(model)}
                </Badge>
              ))}
              {judgeModel ? (
                <Badge
                  variant="outline"
                  className="h-7 rounded-full border-primary/25 bg-primary/10 px-2.5 text-primary"
                >
                  裁决者 · {getModelDisplayName(judgeModel)}
                </Badge>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {expertModels.map((model, index) => {
          const result = expertResults.find((item) => item.model.id === model.id)

          return (
            <div
              key={model.id}
              className="surface-panel rounded-[28px] border border-border/70 px-4 py-4 shadow-[var(--surface-shadow-soft)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-xs font-medium uppercase tracking-[0.24em] text-primary/75">
                    专家 {index + 1}
                  </div>
                  <div className="text-sm font-semibold text-foreground">{getModelDisplayName(model)}</div>
                  <div className="text-xs text-muted-foreground">{getModelRoleLabel(model, defaultGeneralModel?.id)}</div>
                </div>
                <Badge
                  variant="outline"
                  className="h-7 rounded-full border-border/70 bg-background/70 px-2.5 text-muted-foreground"
                >
                  {result?.status === "loading"
                    ? "会诊中"
                    : result?.status === "success"
                      ? "已返回"
                      : result?.status === "error"
                        ? "失败"
                        : "待开始"}
                </Badge>
              </div>

              <div className="mt-4 space-y-3">
                <div className="rounded-[22px] border border-border/70 bg-background/60 px-4 py-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <CheckCircle2Icon className="size-4 text-primary" />
                    摘要
                  </div>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {result?.status === "success"
                      ? summarizeText(result.text)
                      : result?.status === "error"
                        ? result.error || "请求失败"
                        : "等待本轮专家返回结论。"}
                  </p>
                </div>

                <div className="rounded-[22px] border border-border/70 bg-background/60 px-4 py-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <AlertTriangleIcon className="size-4 text-primary" />
                    观察重点
                  </div>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {payload?.image && !model.supportsImageInput
                      ? "该模型主要根据文本描述和其他上下文提供补充判断，适合比较表达方式和风险提醒。"
                      : model.supportsImageInput
                        ? "更适合比较图片理解、症状描述和护理顺序。"
                        : isReasoningModel(model)
                          ? "更适合比较分析深度、风险权重和判断链路。"
                          : "更适合作为主路径对照，判断默认答案是否已经足够稳定。"}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="surface-panel rounded-[28px] border border-border/70 px-5 py-5 shadow-[var(--surface-shadow-soft)]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <ScaleIcon className="size-4 text-primary" />
              <h4 className="text-base font-semibold text-foreground">裁决者总结</h4>
            </div>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              {comparisonNote}
            </p>
          </div>
          {judgeResult ? (
            <Badge
              variant="outline"
              className="h-7 rounded-full border-primary/25 bg-primary/10 px-2.5 text-primary"
            >
              {judgeResult.status === "loading" ? "裁决中" : getModelDisplayName(judgeResult.model)}
            </Badge>
          ) : null}
        </div>

        <div className="mt-4 rounded-[24px] border border-border/70 bg-background/60 px-4 py-4">
          <div className="mb-3 text-sm font-medium text-foreground">
            {judgeResult ? `${getModelDisplayName(judgeResult.model)} 的最终输出` : "等待裁决者"}
          </div>
          <div className="space-y-3 text-sm leading-7 text-muted-foreground">
            {judgeResult?.status === "success" ? (
              judgeResult.text.split("\n").filter(Boolean).map((line, index) => (
                <p key={`${judgeResult.model.id}-${index}`}>{line}</p>
              ))
            ) : judgeResult?.status === "error" ? (
              <p>{judgeResult.text || judgeResult.error || "裁决者请求失败。"}</p>
            ) : judgeResult?.status === "loading" ? (
              <p>裁决者正在综合三位专家意见，请稍候…</p>
            ) : (
              <p>发起会诊后，这里会给出最终结论排序、证据依据、一致点、冲突点、风险等级和推荐行动。</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
