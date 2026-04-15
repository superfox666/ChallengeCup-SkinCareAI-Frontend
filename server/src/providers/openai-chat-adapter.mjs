import { ProviderAdapter } from "./provider-adapter.mjs"
import { requestJson } from "../utils/http.mjs"

function extractChatText(data) {
  return data?.choices?.[0]?.message?.content ?? ""
}

function buildVisionContent(input) {
  const content = []

  if (input?.text?.trim()) {
    content.push({
      type: "text",
      text: input.text.trim(),
    })
  }

  if (input?.image?.transportDataUrl) {
    content.push({
      type: "image_url",
      image_url: {
        url: input.image.transportDataUrl,
      },
    })
  }

  return content
}

function buildChatMessagesWithSystem(payload) {
  const messages = []

  if (payload.systemPrompt) {
    messages.push({
      role: "system",
      content: payload.systemPrompt,
    })
  }

  return [...messages, ...payload.messages]
}

export class OpenAIChatAdapter extends ProviderAdapter {
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
      throw new Error(response.data?.error?.message || `OpenAI models failed with ${response.status}`)
    }

    return response.data?.data ?? []
  }

  async chat(payload) {
    const start = Date.now()
    const response = await requestJson(
      `${this.config.ikunBaseUrl}/v1/chat/completions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.ikunApiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          model: payload.modelConfig.modelId,
          stream: false,
          max_tokens: payload.maxTokens ?? 512,
          messages: buildChatMessagesWithSystem(payload),
          ...(payload.enableThinking ? { extra_body: { enable_thinking: true } } : {}),
        }),
      },
      this.config.requestTimeoutMs
    )

    if (!response.ok) {
      throw new Error(response.data?.error?.message || `OpenAI chat failed with ${response.status}`)
    }

    return {
      providerId: payload.modelConfig.providerId,
      message: extractChatText(response.data),
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
    const start = Date.now()
    const response = await requestJson(
      `${this.config.ikunBaseUrl}/v1/chat/completions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.ikunApiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          model: payload.modelConfig.modelId,
          stream: false,
          max_tokens: payload.maxTokens ?? 512,
          messages: [
            ...(payload.systemPrompt
              ? [
                  {
                    role: "system",
                    content: payload.systemPrompt,
                  },
                ]
              : []),
            {
              role: "user",
              content: buildVisionContent(payload.input),
            },
          ],
        }),
      },
      this.config.requestTimeoutMs
    )

    if (!response.ok) {
      throw new Error(response.data?.error?.message || `OpenAI vision failed with ${response.status}`)
    }

    return {
      providerId: payload.modelConfig.providerId,
      message: extractChatText(response.data),
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
        maxTokens: 8,
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
