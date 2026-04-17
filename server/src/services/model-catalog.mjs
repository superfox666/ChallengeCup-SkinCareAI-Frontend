import { findCuratedModelById, getStaticCuratedModels } from "../registry/model-registry.mjs"

function buildProviderId(ownedBy) {
  if (ownedBy?.includes("deepseek")) return "deepseek"
  if (ownedBy?.includes("openai")) return "openai"
  if (ownedBy?.includes("anthropic") || ownedBy?.includes("aws") || ownedBy?.includes("vertex")) return "anthropic"
  if (ownedBy?.includes("qwen") || ownedBy?.includes("ali")) return "qwen"
  if (ownedBy?.includes("meta")) return "meta"
  return ownedBy || "custom"
}

export class ModelCatalogService {
  constructor(providerRegistry, healthService) {
    this.providerRegistry = providerRegistry
    this.healthService = healthService
    this.cachedUpstreamModels = []
  }

  async refreshUpstreamModels() {
    const adapter = this.providerRegistry["openai-chat"]
    const models = await adapter.listUpstreamModels()
    this.cachedUpstreamModels = models
    return models
  }

  async listModels({ refresh = false } = {}) {
    const upstreamModels =
      refresh || this.cachedUpstreamModels.length === 0
        ? await this.refreshUpstreamModels()
        : this.cachedUpstreamModels

    const upstreamMap = Object.fromEntries(upstreamModels.map((model) => [model.id, model]))
    const curated = getStaticCuratedModels()
    const healthMap = refresh
      ? await this.healthService.getHealthMap(curated, true)
      : Object.fromEntries(
          curated.map((model) => [
            model.id,
            this.healthService.getCachedHealth(model.id) || {
              status: "unknown",
              latencyMs: null,
            },
          ])
        )

    return curated.map((model) => {
      const upstream = upstreamMap[model.modelId] || upstreamMap[model.id]
      const health = healthMap[model.id]
      const adapter = this.providerRegistry[model.apiFormat]
      const requiresUpstreamPresence =
        model.apiFormat === "openai-chat" || model.apiFormat === "openai-responses"
      const isReachableModel = requiresUpstreamPresence ? Boolean(upstream) : Boolean(adapter)
      const resolvedStatus = !isReachableModel
        ? "offline"
        : upstream && health.status === "offline"
          ? "degraded"
          : health.status

      return {
        ...model,
        providerId: model.providerId || buildProviderId(upstream?.owned_by),
        supportedEndpointTypes: upstream?.supported_endpoint_types || [],
        status: resolvedStatus,
        latencyMs: isReachableModel ? health.latencyMs : null,
        available: isReachableModel,
      }
    })
  }

  getModelById(modelId) {
    return findCuratedModelById(modelId)
  }
}
