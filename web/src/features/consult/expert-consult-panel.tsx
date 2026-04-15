import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  AlertTriangleIcon,
  BrainCircuitIcon,
  CheckCircle2Icon,
  ImageIcon,
  LoaderCircleIcon,
  MessageSquareTextIcon,
  SparklesIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { InfoHint } from "@/components/ui/info-hint"
import { mockAdapter } from "@/lib/mock-adapter"
import {
  getDefaultBudgetModel,
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
  status: "idle" | "loading" | "success" | "error"
  text: string
  error?: string
}

function createVirtualConversation(model: ModelDefinition): Conversation {
  const timestamp = new Date().toISOString()

  return {
    id: `consult-${model.id}-${timestamp}`,
    title: "轻量专家会诊",
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

function summarizeText(text: string) {
  return text.replace(/\s+/g, " ").trim().slice(0, 120)
}

export function ExpertConsultPanel({
  models,
  currentModel,
  messages,
  defaultGeneralModel,
}: ExpertConsultPanelProps) {
  const [results, setResults] = useState<ConsultResult[]>([])
  const [running, setRunning] = useState(false)
  const autoRunKeyRef = useRef<string | null>(null)
  const payload = useMemo(() => extractLatestUserPayload(messages), [messages])
  const defaultVisionModel = useMemo(() => getDefaultVisionModel(models), [models])
  const defaultReasoningModel = useMemo(() => getDefaultReasoningModel(models), [models])
  const defaultBudgetModel = useMemo(() => getDefaultBudgetModel(models), [models])

  const consultModels = useMemo(() => {
    const supplementModels = (
      baseModels: ModelDefinition[],
      predicate?: (model: ModelDefinition) => boolean
    ) => {
      if (baseModels.length >= 2) {
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

    if (!payload) {
      return []
    }

    if (payload.image) {
      const reasoningVisionModel =
        models.find((model) => model.supportsImageInput && isReasoningModel(model)) ?? null

      return supplementModels(
        uniqModels([
          defaultVisionModel,
          currentModel.supportsImageInput ? currentModel : null,
          reasoningVisionModel,
          defaultGeneralModel,
          defaultReasoningModel,
        ]),
        undefined
      )
    }

    return supplementModels(
      uniqModels([
        defaultGeneralModel,
        currentModel,
        defaultReasoningModel,
        defaultBudgetModel,
      ]),
      (model) => model.sessionType === "text"
    )
  }, [
    currentModel,
    defaultBudgetModel,
    defaultGeneralModel,
    defaultReasoningModel,
    defaultVisionModel,
    models,
    payload,
  ])

  const comparisonNote = useMemo(() => {
    const successResults = results.filter((item) => item.status === "success")

    if (successResults.length < 2) {
      return "会诊完成后，这里会总结各模型结论的一致点和差异点。"
    }

    const uniqueSummaries = new Set(successResults.map((item) => summarizeText(item.text)))

    if (uniqueSummaries.size <= 1) {
      return "几位模型的结论整体接近，可以优先采用默认推荐模型的回答做展示。"
    }

    return "不同模型对风险提示、护理重点或表达顺序存在差异，建议重点比较是否建议就医、是否强调补充信息、以及护理优先级。"
  }, [results])

  const runConsult = useCallback(async () => {
    if (!payload || consultModels.length === 0 || running) {
      return
    }

    setRunning(true)
    setResults(consultModels.map((model) => ({ model, status: "loading", text: "" })))

    const nextResults = await Promise.all(
      consultModels.map(async (model) => {
        const request = {
          conversation: createVirtualConversation(model),
          history: [] as Message[],
          model,
          input: payload,
        }

        try {
          const response = await serverAdapter.sendMessage(request)

          return {
            model,
            status: "success" as const,
            text: response.text,
          }
        } catch (error) {
          try {
            const fallback = await mockAdapter.sendMessage(request)

            return {
              model,
              status: "success" as const,
              text: fallback.text,
            }
          } catch {
            return {
              model,
              status: "error" as const,
              text: "",
              error: error instanceof Error ? error.message : "会诊失败",
            }
          }
        }
      })
    )

    setResults(nextResults)
    setRunning(false)
  }, [consultModels, payload, running])

  const autoRunKey = useMemo(() => {
    if (!payload || consultModels.length === 0) {
      return null
    }

    return JSON.stringify({
      text: payload.text,
      imageId: payload.image?.id ?? null,
      modelIds: consultModels.map((model) => model.id),
    })
  }, [consultModels, payload])

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
              <h3 className="text-lg font-semibold tracking-tight text-foreground">轻量专家会诊</h3>
              <InfoHint
                label="轻量专家会诊"
                content="这是答辩加分项，不改变主聊天链路。它只围绕当前单条问题做 2 到 3 个代表模型的并排对照。"
                align="start"
              />
            </div>
            <p className="text-sm leading-7 text-muted-foreground">
              适合对同一个问题快速比较默认模型、深度推理模型和成本友好模型的结论差异。
            </p>
          </div>
          <Button
            type="button"
            className="h-9 rounded-full px-4"
            onClick={() => void runConsult()}
            disabled={!payload || consultModels.length === 0 || running}
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

        <div className="mt-4 grid gap-3 xl:grid-cols-2">
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
              {consultModels.map((model) => (
                <Badge
                  key={model.id}
                  variant="outline"
                  className="h-7 rounded-full border-border/70 bg-background/70 px-2.5 text-foreground"
                >
                  {getModelDisplayName(model)}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
        {consultModels.map((model) => {
          const result = results.find((item) => item.model.id === model.id)

          return (
            <div
              key={model.id}
              className="surface-panel rounded-[28px] border border-border/70 px-4 py-4 shadow-[var(--surface-shadow-soft)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
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
                    简要结论
                  </div>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {result?.status === "success"
                      ? summarizeText(result.text)
                      : result?.status === "error"
                        ? result.error || "会诊失败"
                        : "等待开始会诊"}
                  </p>
                </div>

                <div className="rounded-[22px] border border-border/70 bg-background/60 px-4 py-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <AlertTriangleIcon className="size-4 text-primary" />
                    差异观察
                  </div>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {payload?.image && !model.supportsImageInput
                      ? "该模型主要基于文字描述提供补充视角，适合比较表述方式、风险提醒和护理优先级。"
                      : model.supportsImageInput
                      ? "更适合比较图片理解、症状描述和护理顺序。"
                      : isReasoningModel(model)
                        ? "更适合比较分析深度、风险提醒和判断链路。"
                        : "更适合作为默认对照，观察结论是否足够稳定清晰。"}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="surface-panel-muted rounded-[24px] border border-border/70 px-4 py-4 text-sm leading-7 text-muted-foreground">
        {comparisonNote}
      </div>
    </div>
  )
}
