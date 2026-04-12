export class ProviderAdapter {
  constructor(config) {
    this.config = config
  }

  async listUpstreamModels() {
    throw new Error("listUpstreamModels() must be implemented")
  }

  async chat() {
    throw new Error("chat() must be implemented")
  }

  async vision() {
    throw new Error("vision() must be implemented")
  }

  async healthCheck() {
    return {
      status: "unknown",
      latencyMs: null,
    }
  }
}
