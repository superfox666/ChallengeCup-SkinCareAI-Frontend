import http from "node:http"

import { getServerConfig } from "./config.mjs"
import { MockProvider } from "./providers/mock-provider.mjs"
import { createProviderRegistry } from "./services/providers.mjs"
import { ModelHealthService } from "./services/model-health.mjs"
import { ModelCatalogService } from "./services/model-catalog.mjs"
import { readJsonBody, sendJson, sendSseHeaders, writeSseEvent } from "./utils/http.mjs"

const config = getServerConfig()
const providerRegistry = createProviderRegistry(config)
const mockProvider = new MockProvider(config)
const healthService = new ModelHealthService(config, providerRegistry)
const modelCatalog = new ModelCatalogService(providerRegistry, healthService)

const TEXT_SYSTEM_PROMPT = `
你是 SkinCareAI 的皮肤健康咨询助手，只处理皮肤科与皮肤护理相关问题，必须全程使用简体中文回答。

回答边界：
1. 只聚焦皮肤、护肤、皮炎、湿疹、痤疮、真菌感染、玫瑰痤疮、荨麻疹、银屑病、敏感肌、屏障受损等问题。
2. 不要把问题误判到与皮肤无关的科室；如果用户明显跑题，要直接说明当前系统主要处理皮肤相关问题。
3. 不直接下最终诊断，不替代医生面诊、检查和处方。
4. 不要答非所问，不要输出空泛鸡汤，不要忽略用户给出的部位、病程、诱因、瘙痒、疼痛、渗出、用药史等信息。
5. 即使用户只输入 hi、hello、test、问号、乱码或占位符，也必须继续使用简体中文，说明信息不足，并把对话拉回皮肤问题；不要切换成通用聊天助手、自我介绍或英文寒暄。

回答结构：
1. 最可能的疾病或问题：给出 1 到 3 个候选，并明确“最可能”的一个。
2. 判断依据：结合部位、形态、颜色、鳞屑/丘疹/脓疱/渗出、瘙痒或疼痛、病程、诱因，以及可用的知识图谱线索解释。
3. 还需要确认的信息：如果证据不足，明确追问 2 到 4 个关键问题。
4. 西医护理建议：给出简洁、可执行的日常护理和处理建议。
5. 中医辨证与调护：补充可能证型、调护思路，以及可与医生讨论的中药或中成药方向，但不要把处方写成确定结论。
6. 中医配伍比例建议：仅在证据较充分时，围绕“最可能”的疾病和证型，给出方向性的配伍结构或占比思路，例如清热、祛湿、凉血、止痒等治法的大致比例，或君臣佐使的结构比例；绝对不要提供克数、剂量、煎服法和确定处方。若信息不足、风险较高，必须明确写“暂不建议给出配药比例，需线下中医师辨证”。
7. 风险提示：明确哪些情况需要尽快线下就医。

风格要求：
1. 语气专业、克制、清楚，适合比赛演示。
2. 如果暂时无法判断，要明确写“目前无法确定，建议补充……”，不要编造确定结论。
`.trim()

const VISION_SYSTEM_PROMPT = `
你是 SkinCareAI 的皮肤图片问诊助手，只处理皮肤、皮损、面部泛红、痤疮、湿疹、真菌感染等相关图像分析，必须全程使用简体中文回答。

回答边界：
1. 先判断图片是否真的是皮肤或病灶区域，是否足够清晰。
2. 如果图片不是皮肤图片、不是病灶近景，或者无法看清皮肤细节，要明确说明当前图片不适合做皮肤判断，并提示用户补拍清晰的皮肤局部照片。
3. 不要把非皮肤图片解释成品牌、logo、设计风格分析。
4. 不直接下最终诊断，不替代医生面诊、检查和处方。
5. 即使用户只输入 hi、hello、test、问号、乱码或占位符，也必须继续使用简体中文，说明信息不足，并把对话拉回皮肤图片问诊；不要切换成通用聊天助手、自我介绍或英文寒暄。

回答结构：
1. 图片是否适合判断：先说明能否用于皮肤分析。
2. 最可能的疾病或问题：给出 1 到 3 个候选，并明确“最可能”的一个。
3. 判断依据：结合部位、颜色、边界、鳞屑、丘疹、渗出、对称性等可见线索解释。
4. 还需要补充的信息：明确还需要的病史、症状或补拍角度。
5. 西医护理建议：给出简洁、可执行的建议。
6. 中医辨证与调护：补充可能证型与可讨论的调护方向，不把处方写成确定结论。
7. 中医配伍比例建议：仅在图片和文字信息足以支撑时，围绕“最可能”的疾病和证型，给出方向性的配伍结构或占比思路；不要提供克数、剂量、煎服法和确定处方。若证据不足，必须明确写“暂不建议给出配药比例，需线下中医师辨证”。
8. 风险提示：哪些情况应尽快线下就医。
`.trim()

function getAdapter(modelConfig) {
  return providerRegistry[modelConfig.apiFormat]
}

function buildChatMessages(body) {
  const history = Array.isArray(body?.history) ? body.history : []
  const messages = history.flatMap((message) =>
    message.parts
      .filter((part) => part.type === "text")
      .map((part) => ({
        role: message.role,
        content: part.text,
      }))
  )

  const overrideText = body?.input?.text?.trim()

  if (overrideText && messages.length > 0) {
    for (let index = messages.length - 1; index >= 0; index -= 1) {
      if (messages[index].role === "user") {
        messages[index] = {
          ...messages[index],
          content: overrideText,
        }
        break
      }
    }
  }

  if (messages.length > 0) {
    return messages
  }

  if (overrideText) {
    return [
      {
        role: "user",
        content: overrideText,
      },
    ]
  }

  return []
}

async function withFallback(handler, fallbackHandler) {
  try {
    return await handler()
  } catch (error) {
    if (!config.fallbackToMock) {
      throw error
    }

    const fallback = await fallbackHandler()
    return {
      ...fallback,
      meta: {
        ...(fallback.meta || {}),
        fallback: true,
        errorMessage: error instanceof Error ? error.message : "Unknown upstream error",
      },
    }
  }
}

function splitIntoChunks(text) {
  const chunks = []
  let buffer = ""

  for (const char of text) {
    buffer += char

    if (buffer.length >= 12 || /[，。！？\n]/.test(char)) {
      chunks.push(buffer)
      buffer = ""
    }
  }

  if (buffer) {
    chunks.push(buffer)
  }

  return chunks
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host}`)

  if (request.method === "OPTIONS") {
    sendJson(response, 204, {})
    return
  }

  if (request.method === "GET" && url.pathname === "/api/health") {
    sendJson(response, 200, {
      status: "ok",
      service: "skincareai-server-shell",
      mode: "real-adapter-ready",
      provider: "ikun-api",
      timestamp: new Date().toISOString(),
    })
    return
  }

  if (request.method === "GET" && url.pathname === "/api/models") {
    const refresh = url.searchParams.get("refresh") === "1"
    const models = await modelCatalog.listModels({ refresh })
    sendJson(response, 200, {
      models,
      refreshedAt: new Date().toISOString(),
    })
    return
  }

  if (request.method === "POST" && url.pathname === "/api/chat") {
    const body = await readJsonBody(request)
    const modelConfig = modelCatalog.getModelById(body?.modelId)

    if (!modelConfig) {
      sendJson(response, 400, {
        error: "INVALID_MODEL",
        message: "Unknown modelId",
      })
      return
    }

    const adapter = getAdapter(modelConfig)

    const result = await withFallback(
      () =>
        adapter.chat({
          modelConfig,
          messages: buildChatMessages(body),
          input: body?.input || {},
          systemPrompt: TEXT_SYSTEM_PROMPT,
          maxTokens: body?.maxTokens ?? 512,
          enableThinking: modelConfig.id.includes("thinking") || modelConfig.id.includes("r1"),
        }),
      () =>
        mockProvider.chat({
          modelConfig,
          messages: buildChatMessages(body),
          input: body?.input || {},
        })
    )

    sendJson(response, 200, result)
    return
  }

  if (request.method === "POST" && url.pathname === "/api/chat/stream") {
    const body = await readJsonBody(request)
    const modelConfig = modelCatalog.getModelById(body?.modelId)

    if (!modelConfig) {
      sendJson(response, 400, {
        error: "INVALID_MODEL",
        message: "Unknown modelId",
      })
      return
    }

    const adapter = getAdapter(modelConfig)
    const result = await withFallback(
      () =>
        adapter.chat({
          modelConfig,
          messages: buildChatMessages(body),
          input: body?.input || {},
          systemPrompt: TEXT_SYSTEM_PROMPT,
          maxTokens: body?.maxTokens ?? 512,
          enableThinking: modelConfig.id.includes("thinking") || modelConfig.id.includes("r1"),
        }),
      () =>
        mockProvider.chat({
          modelConfig,
          messages: buildChatMessages(body),
          input: body?.input || {},
        })
    )

    sendSseHeaders(response)
    writeSseEvent(response, "meta", {
      providerId: result.providerId,
      latencyMs: result.latencyMs ?? null,
      meta: result.meta ?? {},
    })

    const chunks = splitIntoChunks(result.message || "")

    for (const chunk of chunks) {
      writeSseEvent(response, "delta", { text: chunk })
      await new Promise((resolve) => setTimeout(resolve, 40))
    }

    writeSseEvent(response, "done", { text: result.message || "" })
    response.end()
    return
  }

  if (request.method === "POST" && url.pathname === "/api/vision") {
    const body = await readJsonBody(request)
    const modelConfig = modelCatalog.getModelById(body?.modelId)

    if (!modelConfig || !modelConfig.supportsVision) {
      sendJson(response, 400, {
        error: "INVALID_MODEL",
        message: "vision endpoint requires a configured vision-capable modelId",
      })
      return
    }

    const adapter = getAdapter(modelConfig)
    const result = await withFallback(
      () =>
        adapter.vision({
          modelConfig,
          messages: [],
          input: body?.input || {},
          systemPrompt: VISION_SYSTEM_PROMPT,
          maxTokens: body?.maxTokens ?? 512,
        }),
      () =>
        mockProvider.vision({
          modelConfig,
          messages: [],
          input: body?.input || {},
        })
    )

    sendJson(response, 200, result)
    return
  }

  sendJson(response, 404, {
    error: "NOT_FOUND",
    message: `No route for ${request.method} ${url.pathname}`,
  })
})

server.listen(config.port, config.host, () => {
  console.log(`SkinCareAI server shell listening on http://${config.host}:${config.port}`)
})
