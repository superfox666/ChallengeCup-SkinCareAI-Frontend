import type { ComposerPayload, ModelDefinition } from "@/types/chat"

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://127.0.0.1:8787"

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(errorBody || `Request failed with ${response.status}`)
  }

  return response.json() as Promise<T>
}

export async function fetchServerModels(refresh = false) {
  const response = await requestJson<{ models: ModelDefinition[]; refreshedAt: string }>(
    `/api/models${refresh ? "?refresh=1" : ""}`
  )

  return {
    ...response,
    models: response.models.map((model) => ({
      ...model,
      supportsImageInput:
        model.supportsImageInput ?? model.supportsVision ?? false,
      displayName: model.displayName || model.name,
      name: model.displayName || model.name,
    })),
  }
}

export async function postChatMessage(payload: {
  modelId: string
  history: Array<{ role: string; parts: Array<{ type: string; text?: string }> }>
  input: ComposerPayload
}) {
  return requestJson<{
    providerId: string
    message: string
    latencyMs?: number | null
    meta?: Record<string, unknown>
  }>("/api/chat", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function streamChatMessage(
  payload: Parameters<typeof postChatMessage>[0],
  handlers: {
    onMeta?: (meta: { providerId?: string; latencyMs?: number | null; meta?: Record<string, unknown> }) => void
    onDelta: (delta: string) => void
    onDone?: (finalText: string) => void
  }
) {
  const response = await fetch(`${API_BASE_URL}/api/chat/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok || !response.body) {
    const errorBody = await response.text()
    throw new Error(errorBody || `Stream request failed with ${response.status}`)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ""

  while (true) {
    const { value, done } = await reader.read()

    if (done) {
      break
    }

    buffer += decoder.decode(value, { stream: true })

    while (buffer.includes("\n\n")) {
      const boundaryIndex = buffer.indexOf("\n\n")
      const rawEvent = buffer.slice(0, boundaryIndex)
      buffer = buffer.slice(boundaryIndex + 2)

      const lines = rawEvent.split("\n")
      const eventName = lines.find((line) => line.startsWith("event:"))?.replace("event:", "").trim()
      const dataLine = lines.find((line) => line.startsWith("data:"))?.replace("data:", "").trim()

      if (!eventName || !dataLine) {
        continue
      }

      const payload = JSON.parse(dataLine)

      if (eventName === "meta") {
        handlers.onMeta?.(payload)
      }

      if (eventName === "delta") {
        handlers.onDelta(payload.text || "")
      }

      if (eventName === "done") {
        handlers.onDone?.(payload.text || "")
      }
    }
  }
}

export async function postVisionMessage(payload: {
  modelId: string
  input: ComposerPayload
}) {
  return requestJson<{
    providerId: string
    message: string
    latencyMs?: number | null
    meta?: Record<string, unknown>
  }>("/api/vision", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}
