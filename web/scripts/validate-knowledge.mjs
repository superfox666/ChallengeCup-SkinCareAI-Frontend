import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, "..")
const knowledgeRoot = path.join(projectRoot, "src", "content", "knowledge")
const entriesDir = path.join(knowledgeRoot, "entries")
const sourceRegistryPath = path.join(knowledgeRoot, "sources", "source-registry.json")
const manifestPath = path.join(knowledgeRoot, "indexes", "manifest.json")
const validSourceTypes = new Set([
  "local-curated",
  "official-medical",
  "official-public-health",
  "teaching-resource",
  "reference-only",
])
const validCopyrightStatuses = new Set([
  "unknown",
  "internal-curated",
  "public-reference-only",
  "restricted",
  "requires-review",
])
const validUsageScopes = new Set([
  "knowledge-page-only",
  "internal-reference-only",
  "future-retrieval-candidate",
  "blocked",
])

const validCategories = new Set(["tcm", "western", "integrated"])
const validReviewStatuses = new Set(["draft", "reviewed", "approved"])
const requiredFields = [
  "id",
  "sourceId",
  "name",
  "slug",
  "category",
  "summary",
  "symptoms",
  "careAdvice",
  "redFlags",
  "whenToSeeDoctor",
  "triageAdvice",
  "displayOrder",
  "featured",
  "visible",
  "aliases",
  "searchKeywords",
  "source",
  "sourceUrl",
  "updatedAt",
  "reviewStatus",
]

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"))
}

function isValidUrl(value) {
  if (!value) {
    return true
  }

  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

const sourceRegistry = readJson(sourceRegistryPath)
const sourceIds = new Set()
const allowedSourceIds = new Set()
const manifestEntries = readJson(manifestPath)
const entryFiles = fs.readdirSync(entriesDir).filter((file) => file.endsWith(".json"))
const seenIds = new Set()
const manifestIds = new Set()
const errors = []

for (const sourceEntry of sourceRegistry) {
  if (!sourceEntry.id) {
    errors.push(`source-registry: source entry is missing id`)
    continue
  }

  if (sourceIds.has(sourceEntry.id)) {
    errors.push(`source-registry: duplicate source id "${sourceEntry.id}"`)
  }

  sourceIds.add(sourceEntry.id)

  if (sourceEntry.allowed === true) {
    allowedSourceIds.add(sourceEntry.id)
  }

  if (!validSourceTypes.has(sourceEntry.sourceType)) {
    errors.push(`source-registry: invalid sourceType "${sourceEntry.sourceType}" on "${sourceEntry.id}"`)
  }

  if (!validCopyrightStatuses.has(sourceEntry.copyrightStatus)) {
    errors.push(
      `source-registry: invalid copyrightStatus "${sourceEntry.copyrightStatus}" on "${sourceEntry.id}"`
    )
  }

  if (!validUsageScopes.has(sourceEntry.usageScope)) {
    errors.push(`source-registry: invalid usageScope "${sourceEntry.usageScope}" on "${sourceEntry.id}"`)
  }

  if (typeof sourceEntry.allowed !== "boolean") {
    errors.push(`source-registry: allowed must be boolean on "${sourceEntry.id}"`)
  }

  for (const field of ["name", "checkedBy", "checkedAt", "updatedAt", "notes"]) {
    if (!sourceEntry[field] || typeof sourceEntry[field] !== "string") {
      errors.push(`source-registry: ${field} must be a non-empty string on "${sourceEntry.id}"`)
    }
  }

  if (typeof sourceEntry.url !== "string" || !isValidUrl(sourceEntry.url)) {
    errors.push(`source-registry: url must be empty or a valid URL on "${sourceEntry.id}"`)
  }
}

for (const item of manifestEntries) {
  if (!item.id || !item.file) {
    errors.push(`manifest: each manifest item must include id and file`)
    continue
  }

  if (manifestIds.has(item.id)) {
    errors.push(`manifest: duplicate id "${item.id}"`)
  }
  manifestIds.add(item.id)

  const fullPath = path.join(knowledgeRoot, item.file)
  if (!fs.existsSync(fullPath)) {
    errors.push(`manifest: missing file "${item.file}" for id "${item.id}"`)
  }

  if (typeof item.displayOrder !== "number") {
    errors.push(`manifest: displayOrder must be a number on "${item.id}"`)
  }

  if (typeof item.featured !== "boolean") {
    errors.push(`manifest: featured must be a boolean on "${item.id}"`)
  }

  if (typeof item.visible !== "boolean") {
    errors.push(`manifest: visible must be a boolean on "${item.id}"`)
  }
}

for (const fileName of entryFiles) {
  const fullPath = path.join(entriesDir, fileName)
  const entry = readJson(fullPath)

  for (const field of requiredFields) {
    if (!(field in entry)) {
      errors.push(`${fileName}: missing required field "${field}"`)
    }
  }

  if (entry.id) {
    if (seenIds.has(entry.id)) {
      errors.push(`${fileName}: duplicate id "${entry.id}"`)
    }
    seenIds.add(entry.id)
  }

  if (entry.category && !validCategories.has(entry.category)) {
    errors.push(`${fileName}: invalid category "${entry.category}"`)
  }

  if (entry.reviewStatus && !validReviewStatuses.has(entry.reviewStatus)) {
    errors.push(`${fileName}: invalid reviewStatus "${entry.reviewStatus}"`)
  }

  if (entry.sourceId && !sourceIds.has(entry.sourceId)) {
    errors.push(`${fileName}: unknown sourceId "${entry.sourceId}"`)
  }

  if (entry.sourceId && !allowedSourceIds.has(entry.sourceId)) {
    errors.push(`${fileName}: sourceId "${entry.sourceId}" is not allowed for knowledge-page content`)
  }

  if (!entry.source || typeof entry.source !== "string" || !entry.source.trim()) {
    errors.push(`${fileName}: source must be a non-empty string`)
  }

  if (typeof entry.sourceUrl !== "string" || !isValidUrl(entry.sourceUrl)) {
    errors.push(`${fileName}: sourceUrl must be empty or a valid URL`)
  }

  for (const field of ["symptoms", "careAdvice", "redFlags", "whenToSeeDoctor"]) {
    if (!Array.isArray(entry[field]) || entry[field].length === 0) {
      errors.push(`${fileName}: ${field} must be a non-empty array`)
    }
  }

  for (const field of ["aliases", "searchKeywords"]) {
    if (!Array.isArray(entry[field])) {
      errors.push(`${fileName}: ${field} must be an array`)
    }
  }

  if ("relatedImageIds" in entry && !Array.isArray(entry.relatedImageIds)) {
    errors.push(`${fileName}: relatedImageIds must be an array when present`)
  }

  if (typeof entry.displayOrder !== "number") {
    errors.push(`${fileName}: displayOrder must be a number`)
  }

  if (typeof entry.featured !== "boolean") {
    errors.push(`${fileName}: featured must be a boolean`)
  }

  if (typeof entry.visible !== "boolean") {
    errors.push(`${fileName}: visible must be a boolean`)
  }

  if (!entry.triageAdvice || typeof entry.triageAdvice !== "string" || !entry.triageAdvice.trim()) {
    errors.push(`${fileName}: triageAdvice must be a non-empty string`)
  }

  if (entry.id && !manifestIds.has(entry.id)) {
    errors.push(`${fileName}: id "${entry.id}" is not included in manifest.json`)
  }
}

if (errors.length > 0) {
  console.error("Knowledge package validation failed:\n")
  for (const error of errors) {
    console.error(`- ${error}`)
  }
  process.exit(1)
}

console.log(
  `Knowledge package validation passed: ${entryFiles.length} entries, ${sourceRegistry.length} sources, ${manifestEntries.length} manifest items.`
)
