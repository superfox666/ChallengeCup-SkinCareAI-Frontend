import path from "node:path"
import { fileURLToPath } from "node:url"

import { loadEnvFiles } from "./utils/env.mjs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, "..")

loadEnvFiles(rootDir)

export function getServerConfig() {
  return {
    rootDir,
    host: process.env.HOST || "127.0.0.1",
    port: Number(process.env.PORT || 8787),
    ikunBaseUrl: process.env.IKUN_BASE_URL || "https://ikunapi.com",
    ikunApiKey: process.env.IKUN_API_KEY || "",
    modelHealthTtlMs: Number(process.env.MODEL_HEALTH_TTL_MS || 5 * 60 * 1000),
    healthTimeoutMs: Number(process.env.MODEL_HEALTH_TIMEOUT_MS || 15000),
    requestTimeoutMs: Number(process.env.REQUEST_TIMEOUT_MS || 30000),
    fallbackToMock: process.env.FALLBACK_TO_MOCK !== "false",
  }
}
