import { curatedModels } from "./curated-models.mjs"

export function getStaticCuratedModels() {
  return curatedModels.map((model) => ({ ...model }))
}

export function findCuratedModelById(modelId) {
  return curatedModels.find((model) => model.id === modelId)
}
