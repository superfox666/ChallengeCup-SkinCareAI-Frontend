import type { ModelDefinition } from "@/types/chat"

import { BrandShowcaseCard } from "@/features/context-rail/brand-showcase-card"
import { DisclaimerCard } from "@/features/context-rail/disclaimer-card"
import { ModelCapabilityCard } from "@/features/context-rail/model-capability-card"

interface ChatContextRailPanelProps {
  model: ModelDefinition
}

export function ChatContextRailPanel({ model }: ChatContextRailPanelProps) {
  return (
    <div className="grid w-full min-w-0 gap-4">
      <BrandShowcaseCard />
      <ModelCapabilityCard model={model} />
      <DisclaimerCard />
    </div>
  )
}
