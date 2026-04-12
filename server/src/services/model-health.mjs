export class ModelHealthService {
  constructor(config, providerRegistry) {
    this.config = config
    this.providerRegistry = providerRegistry
    this.cache = new Map()
  }

  isFresh(entry) {
    if (!entry) {
      return false
    }

    return Date.now() - entry.checkedAt < this.config.modelHealthTtlMs
  }

  async getHealth(modelConfig, refresh = false) {
    const cached = this.cache.get(modelConfig.id)

    if (!refresh && this.isFresh(cached)) {
      return cached
    }

    const adapter = this.providerRegistry[modelConfig.apiFormat]

    if (!adapter) {
      const result = {
        status: "offline",
        latencyMs: null,
        checkedAt: Date.now(),
      }
      this.cache.set(modelConfig.id, result)
      return result
    }

    const start = Date.now()

    try {
      const healthResult = await adapter.healthCheck(modelConfig)
      const result = {
        status: healthResult.status,
        latencyMs: healthResult.latencyMs ?? Date.now() - start,
        checkedAt: Date.now(),
      }

      this.cache.set(modelConfig.id, result)
      return result
    } catch {
      const result = {
        status: "offline",
        latencyMs: null,
        checkedAt: Date.now(),
      }
      this.cache.set(modelConfig.id, result)
      return result
    }
  }

  getCachedHealth(modelId) {
    return this.cache.get(modelId) ?? null
  }

  async getHealthMap(models, refresh = false) {
    const entries = await Promise.all(
      models.map(async (model) => [model.id, await this.getHealth(model, refresh)])
    )

    return Object.fromEntries(entries)
  }
}
