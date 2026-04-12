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
