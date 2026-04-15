import { ProviderAdapter } from "./provider-adapter.mjs"
import { requestJson } from "../utils/http.mjs"

function parseDataUrl(dataUrl = "") {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/)

  if (!match) {
    return null
  }

  return {
    mediaType: match[1],
    data: match[2],
  }
}

function extractAnthropicText(data) {
  return (Array.isArray(data?.content) ? data.content : [])
    .filter((item) => item?.type === "text")
    .map((item) => item?.text ?? "")
    .join("\n")
}

export class AnthropicMessagesAdapter extends ProviderAdapter {
  async listUpstreamModels() {
    const response = await requestJson(
      `${this.config.ikunBaseUrl}/v1/models`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.config.ikunApiKey}`,
        },
      },
      this.config.requestTimeoutMs
    )

    if (!response.ok) {
      throw new Error(response.data?.error?.message || `Anthropic models failed with ${response.status}`)
    }

    return response.data?.data ?? []
  }

  async chat(payload) {
    const start = Date.now()
    const response = await requestJson(
      `${this.config.ikunBaseUrl}/v1/messages`,
      {
        method: "POST",
        headers: {
          "x-api-key": this.config.ikunApiKey,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          model: payload.modelConfig.modelId,
          system: payload.systemPrompt || "You are a helpful assistant.",
          max_tokens: payload.maxTokens ?? 512,
          stream: false,
          messages: payload.messages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
      },
      this.config.requestTimeoutMs
    )

    if (!response.ok) {
      throw new Error(response.data?.error?.message || `Anthropic messages failed with ${response.status}`)
    }

    return {
      providerId: payload.modelConfig.providerId,
      message: extractAnthropicText(response.data),
      latencyMs: Date.now() - start,
      usage: response.data?.usage ?? null,
      raw: response.data,
      meta: {
        apiFormat: payload.modelConfig.apiFormat,
        fallback: false,
      },
    }
  }

  async vision(payload) {
    const imageData = parseDataUrl(payload.input?.image?.transportDataUrl)
    const content = []

    if (payload.input?.text?.trim()) {
      content.push({ type: "text", text: payload.input.text.trim() })
    }

    if (imageData) {
      content.push({
        type: "image",
        source: {
          type: "base64",
          media_type: imageData.mediaType,
          data: imageData.data,
        },
      })
    }

    const start = Date.now()
    const response = await requestJson(
      `${this.config.ikunBaseUrl}/v1/messages`,
      {
        method: "POST",
        headers: {
          "x-api-key": this.config.ikunApiKey,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          model: payload.modelConfig.modelId,
          system: payload.systemPrompt || "You are a helpful vision assistant.",
          max_tokens: payload.maxTokens ?? 512,
          stream: false,
          messages: [{ role: "user", content }],
        }),
      },
      this.config.requestTimeoutMs
    )

    if (!response.ok) {
      throw new Error(response.data?.error?.message || `Anthropic vision failed with ${response.status}`)
    }

    return {
      providerId: payload.modelConfig.providerId,
      message: extractAnthropicText(response.data),
      latencyMs: Date.now() - start,
      usage: response.data?.usage ?? null,
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
