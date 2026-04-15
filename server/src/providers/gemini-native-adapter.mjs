import { ProviderAdapter } from "./provider-adapter.mjs"
import { requestJson } from "../utils/http.mjs"

function parseDataUrl(dataUrl = "") {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/)

  if (!match) {
    return null
  }

  return {
    mimeType: match[1],
    data: match[2],
  }
}

function extractGeminiText(data) {
  return (Array.isArray(data?.candidates) ? data.candidates : [])
    .flatMap((candidate) => candidate?.content?.parts ?? [])
    .map((part) => part?.text ?? "")
    .join("\n")
}

export class GeminiNativeAdapter extends ProviderAdapter {
  async listUpstreamModels() {
    return []
  }

  async chat(payload) {
    const start = Date.now()
    const response = await requestJson(
      `${this.config.ikunBaseUrl}/v1beta/models/${payload.modelConfig.modelId}:generateContent?key=${this.config.ikunApiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          system_instruction: payload.systemPrompt
            ? {
                parts: [{ text: payload.systemPrompt }],
              }
            : undefined,
          contents: [
            {
              role: "user",
              parts: [{ text: payload.messages.map((message) => message.content).join("\n") }],
            },
          ],
        }),
      },
      this.config.requestTimeoutMs
    )

    if (!response.ok) {
      throw new Error(response.data?.error?.message || `Gemini native failed with ${response.status}`)
    }

    return {
      providerId: payload.modelConfig.providerId,
      message: extractGeminiText(response.data),
      latencyMs: Date.now() - start,
      usage: response.data?.usageMetadata ?? null,
      raw: response.data,
      meta: {
        apiFormat: payload.modelConfig.apiFormat,
        fallback: false,
      },
    }
  }

  async vision(payload) {
    const parts = []

    if (payload.input?.text?.trim()) {
      parts.push({ text: payload.input.text.trim() })
    }

    const imageData = parseDataUrl(payload.input?.image?.transportDataUrl)
    if (imageData) {
      parts.push({
        inlineData: {
          mimeType: imageData.mimeType,
          data: imageData.data,
        },
      })
    }

    const start = Date.now()
    const response = await requestJson(
      `${this.config.ikunBaseUrl}/v1beta/models/${payload.modelConfig.modelId}:generateContent?key=${this.config.ikunApiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          system_instruction: payload.systemPrompt
            ? {
                parts: [{ text: payload.systemPrompt }],
              }
            : undefined,
          contents: [
            {
              role: "user",
              parts,
            },
          ],
        }),
      },
      this.config.requestTimeoutMs
    )

    if (!response.ok) {
      throw new Error(response.data?.error?.message || `Gemini native vision failed with ${response.status}`)
    }

    return {
      providerId: payload.modelConfig.providerId,
      message: extractGeminiText(response.data),
      latencyMs: Date.now() - start,
      usage: response.data?.usageMetadata ?? null,
      raw: response.data,
      meta: {
        apiFormat: payload.modelConfig.apiFormat,
        fallback: false,
      },
    }
  }

  async healthCheck(modelConfig) {
    const start = Date.now()

    try {
      await this.chat({
        modelConfig,
        messages: [{ role: "user", content: "Reply with OK only." }],
        systemPrompt: "You are a health check assistant. Reply with OK only.",
      })

      const latencyMs = Date.now() - start

      return {
        status: latencyMs > 12000 ? "degraded" : "online",
        latencyMs,
      }
    } catch {
      return {
        status: "offline",
        latencyMs: null,
      }
    }
  }
}
