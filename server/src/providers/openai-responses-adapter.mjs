import { ProviderAdapter } from "./provider-adapter.mjs"
import { requestJson } from "../utils/http.mjs"

function extractResponseText(data) {
  return (Array.isArray(data?.output) ? data.output : [])
    .flatMap((item) => item?.content ?? [])
    .filter((item) => item?.type === "output_text")
    .map((item) => item?.text ?? "")
    .join("\n")
}

export class OpenAIResponsesAdapter extends ProviderAdapter {
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
      throw new Error(response.data?.error?.message || `Responses models failed with ${response.status}`)
    }

    return response.data?.data ?? []
  }

  async chat(payload) {
    const start = Date.now()
    const response = await requestJson(
      `${this.config.ikunBaseUrl}/v1/responses`,
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
          instructions: payload.systemPrompt,
          input: payload.messages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
      },
      this.config.requestTimeoutMs
    )

    if (!response.ok) {
      throw new Error(response.data?.error?.message || `Responses call failed with ${response.status}`)
    }

    return {
      providerId: payload.modelConfig.providerId,
      message: extractResponseText(response.data),
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
    return this.chat(payload)
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
