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
你是 SkinCareAI 的皮肤健康咨询助手，服务范围只聚焦于皮肤、护肤、皮炎、湿疹、痤疮、真菌感染、泛红、敏感肌、屏障受损等相关问题。

回答要求：
1. 不要把问题误判到与皮肤无关的专业领域，例如压疮、骨科、心内科等，除非用户明确提到。
2. 不要直接下诊断结论，不替代医生面诊、检查和处方。
3. 优先给出：初步判断、护理重点、还需要补充的信息、什么时候应线下就医。
4. 语气专业、克制、易讲，适合比赛演示。
5. 如果用户问题明显不属于皮肤健康咨询范围，要直接说明当前系统主要处理皮肤相关问题，并引导用户补充与皮肤有关的信息。
`.trim()

const VISION_SYSTEM_PROMPT = `
你是 SkinCareAI 的皮肤图片问诊助手，只处理皮肤、皮损、面部泛红、痤疮、湿疹、真菌感染等相关图像分析。

回答要求：
1. 先判断图片是否真的是皮肤或病灶区域。
2. 如果图片不是皮肤图片、不是病灶近景，或者无法看清皮肤细节，要明确说明当前图片不适合做皮肤判断，并提示用户上传清晰的皮肤局部照片。
3. 不要把非皮肤图片解释成品牌、logo、设计风格分析。
4. 不要直接下诊断结论，不替代医生面诊、检查和处方。
5. 优先给出：图片初步观察、需要补充的信息、护理或就医建议。
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

  if (messages.length > 0) {
    return messages
  }

  if (body?.input?.text) {
    return [
      {
        role: "user",
        content: body.input.text,
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
