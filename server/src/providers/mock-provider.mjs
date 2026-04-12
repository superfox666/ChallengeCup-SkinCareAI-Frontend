import { ProviderAdapter } from "./provider-adapter.mjs"

function detectTopic(text) {
  const input = `${text || ""}`.toLowerCase()

  if (input.includes("痘") || input.includes("acne")) {
    return "痤疮样问题"
  }

  if (input.includes("湿疹") || input.includes("皮炎") || input.includes("eczema") || input.includes("dermatitis")) {
    return "皮炎 / 湿疹样问题"
  }

  if (input.includes("图片") || input.includes("image") || input.includes("redness")) {
    return "图片观察与补充描述"
  }

  return "常规皮肤健康咨询"
}

function extractInputText(payload) {
  const directInput = typeof payload?.input?.text === "string" ? payload.input.text : ""
  const historyInput = Array.isArray(payload?.messages)
    ? payload.messages.map((message) => message?.content || message?.text || "").join(" ")
    : ""

  return [directInput, historyInput].filter(Boolean).join(" ")
}

export class MockProvider extends ProviderAdapter {
  async listUpstreamModels() {
    return []
  }

  async chat(payload) {
    const inputText = extractInputText(payload)
    const topic = detectTopic(inputText)

    return {
      providerId: "mock",
      message: [
        "### mock chat response",
        `- 当前主题：${topic}`,
        `- 输入摘要：${inputText || "未提供文本内容"}`,
        "- 当前为 fallback mock 结果",
      ].join("\n"),
      meta: {
        fallback: true,
      },
    }
  }

  async vision(payload) {
    const inputText = extractInputText(payload)
    const topic = detectTopic(inputText)

    return {
      providerId: "mock",
      message: [
        "### mock vision response",
        `- 当前主题：${topic}`,
        `- 输入摘要：${inputText || "未提供文本内容"}`,
        "- 当前为 fallback mock 视觉结果",
      ].join("\n"),
      meta: {
        fallback: true,
      },
    }
  }
}
