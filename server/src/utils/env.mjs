import fs from "node:fs"
import path from "node:path"

export function loadEnvFiles(rootDir) {
  const files = [".env.local", ".env"]

  for (const fileName of files) {
    const fullPath = path.join(rootDir, fileName)

    if (!fs.existsSync(fullPath)) {
      continue
    }

    const raw = fs.readFileSync(fullPath, "utf8")

    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim()

      if (!trimmed || trimmed.startsWith("#")) {
        continue
      }

      const separatorIndex = trimmed.indexOf("=")

      if (separatorIndex === -1) {
        continue
      }

      const key = trimmed.slice(0, separatorIndex).trim()
      const value = trimmed.slice(separatorIndex + 1).trim()

      if (!(key in process.env)) {
        process.env[key] = value
      }
    }
  }
}
