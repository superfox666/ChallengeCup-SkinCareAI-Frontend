import type { ModelDefinition } from "@/types/chat"

import { BrandShowcaseCard } from "@/features/context-rail/brand-showcase-card"
import { DisclaimerCard } from "@/features/context-rail/disclaimer-card"
import { ModelCapabilityCard } from "@/features/context-rail/model-capability-card"

interface ChatContextRailPanelProps {
  model: ModelDefinition
  defaultGeneralModel?: ModelDefinition | null
}

export function ChatContextRailPanel({ model, defaultGeneralModel }: ChatContextRailPanelProps) {
  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col gap-2.5 overflow-y-auto overscroll-contain pr-2 pb-4">
      <BrandShowcaseCard />
      <ModelCapabilityCard model={model} defaultGeneralModel={defaultGeneralModel} />
      <DisclaimerCard />
    </div>
  )
}
