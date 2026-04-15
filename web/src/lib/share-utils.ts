import { getModelDisplayName } from "@/lib/model-config"
import type { Conversation, Message, ModelDefinition } from "@/types/chat"

interface ConversationSharePayload {
  conversation: Conversation
  model: ModelDefinition
  messages: Message[]
}

function formatTimestamp(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatAttachmentLine(message: Message, markdown: boolean) {
  const images = message.parts.filter((part) => part.type === "image")

  if (images.length === 0) {
    return []
  }

  return images.map((part) => {
    const sizeLabel =
      part.image.size > 0 ? ` · ${Math.max(1, Math.round(part.image.size / 1024))} KB` : ""
    const prefix = markdown ? "- " : "• "

    return `${prefix}附图：${part.image.name}${sizeLabel}`
  })
}

function formatTextBlocks(message: Message) {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text.trim())
    .filter(Boolean)
}

function formatMessageBody(message: Message, markdown: boolean) {
  const textBlocks = formatTextBlocks(message)
  const attachmentLines = formatAttachmentLine(message, markdown)
  const emptyLabel = markdown ? "_无正文_" : "无正文"

  if (markdown) {
    return [...textBlocks, ...attachmentLines].join("\n\n") || emptyLabel
  }

  return [...textBlocks, ...attachmentLines].join("\n") || emptyLabel
}

function getMessageLabel(message: Message) {
  return message.role === "assistant" ? "SkinCareAI" : "用户"
}

function getExportableMessages(messages: Message[]) {
  return messages.filter((message) => message.role !== "system")
}

export function buildConversationMarkdown({
  conversation,
  model,
  messages,
}: ConversationSharePayload) {
  const exportableMessages = getExportableMessages(messages)
  const header = [
    `# ${conversation.title}`,
    "",
    `- 导出时间：${formatTimestamp(new Date().toISOString())}`,
    `- 当前模型：${getModelDisplayName(model)}`,
    `- 会话类型：${conversation.sessionType === "vision" ? "图文问诊" : "文本问诊"}`,
    "",
  ]

  const content = exportableMessages.flatMap((message) => [
    `## ${getMessageLabel(message)} · ${formatTimestamp(message.createdAt)}`,
    "",
    formatMessageBody(message, true),
    "",
  ])

  return [...header, ...content].join("\n").trim()
}

export function buildConversationPlainText({
  conversation,
  model,
  messages,
}: ConversationSharePayload) {
  const exportableMessages = getExportableMessages(messages)
  const header = [
    `${conversation.title}`,
    `导出时间：${formatTimestamp(new Date().toISOString())}`,
    `当前模型：${getModelDisplayName(model)}`,
    `会话类型：${conversation.sessionType === "vision" ? "图文问诊" : "文本问诊"}`,
    "",
  ]

  const content = exportableMessages.flatMap((message) => [
    `${getMessageLabel(message)} · ${formatTimestamp(message.createdAt)}`,
    formatMessageBody(message, false),
    "",
  ])

  return [...header, ...content].join("\n").trim()
}

export async function copyTextToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const textarea = document.createElement("textarea")
      textarea.value = text
      textarea.setAttribute("readonly", "true")
      textarea.style.position = "fixed"
      textarea.style.opacity = "0"
      document.body.appendChild(textarea)
      textarea.select()
      const copied = document.execCommand("copy")
      document.body.removeChild(textarea)
      return copied
    } catch {
      return false
    }
  }
}

function sanitizeFilename(value: string) {
  return value
    .trim()
    .split("")
    .map((character) => {
      const codePoint = character.charCodeAt(0)

      if ('<>:"/\\|?*'.includes(character) || codePoint < 32) {
        return "-"
      }

      return character
    })
    .join("")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/[.\u3002\uff0e\uff1f?！!、，,；;：:]+$/g, "")
    .replace(/^-|-$/g, "")
}

export function getConversationExportFilename(conversation: Conversation) {
  const baseName = sanitizeFilename(conversation.title || "skincareai-conversation")
  return `${baseName || "skincareai-conversation"}.md`
}

export function downloadTextFile(filename: string, text: string, mimeType = "text/markdown;charset=utf-8") {
  const blob = new Blob([text], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
