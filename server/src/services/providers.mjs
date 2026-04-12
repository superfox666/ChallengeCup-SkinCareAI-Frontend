import { AnthropicMessagesAdapter } from "../providers/anthropic-messages-adapter.mjs"
import { GeminiNativeAdapter } from "../providers/gemini-native-adapter.mjs"
import { MockProvider } from "../providers/mock-provider.mjs"
import { OpenAIChatAdapter } from "../providers/openai-chat-adapter.mjs"
import { OpenAIResponsesAdapter } from "../providers/openai-responses-adapter.mjs"

export function createProviderRegistry(config) {
  return {
    "openai-chat": new OpenAIChatAdapter(config),
    "openai-responses": new OpenAIResponsesAdapter(config),
    "anthropic-messages": new AnthropicMessagesAdapter(config),
    "gemini-native": new GeminiNativeAdapter(config),
    mock: new MockProvider(config),
  }
}
