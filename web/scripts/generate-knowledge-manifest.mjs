import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, "..")
const entriesDir = path.join(projectRoot, "src", "content", "knowledge", "entries")
const manifestPath = path.join(
  projectRoot,
  "src",
  "content",
  "knowledge",
  "indexes",
  "manifest.json"
)

const files = fs
  .readdirSync(entriesDir)
  .filter((file) => file.endsWith(".json"))
  .map((file) => {
    const fullPath = path.join(entriesDir, file)
    const content = JSON.parse(fs.readFileSync(fullPath, "utf8"))
    return {
      id: content.id,
      file: `entries/${file}`,
      name: content.name,
      slug: content.slug,
      category: content.category,
      displayOrder: typeof content.displayOrder === "number" ? content.displayOrder : Number.MAX_SAFE_INTEGER,
      featured: Boolean(content.featured),
      visible: Boolean(content.visible),
      reviewStatus: content.reviewStatus,
      sourceId: content.sourceId,
    }
  })
  .sort((left, right) => {
    if (left.displayOrder !== right.displayOrder) {
      return left.displayOrder - right.displayOrder
    }

    return left.id.localeCompare(right.id)
  })
  .map(({ id, file, name, slug, category, displayOrder, featured, visible, reviewStatus, sourceId }) => ({
    id,
    file,
    name,
    slug,
    category,
    displayOrder,
    featured,
    visible,
    reviewStatus,
    sourceId,
  }))

fs.writeFileSync(manifestPath, `${JSON.stringify(files, null, 2)}\n`, "utf8")

console.log(`Generated knowledge manifest with ${files.length} entries.`)
