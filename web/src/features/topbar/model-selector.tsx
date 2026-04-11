import type { ModelDefinition } from "@/types/chat"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ModelSelectorProps {
  models: ModelDefinition[]
  value: string
  onChange: (modelId: string) => void
}

export function ModelSelector({ models, value, onChange }: ModelSelectorProps) {
  const textModels = models.filter((model) => model.sessionType === "text")
  const visionModels = models.filter((model) => model.sessionType === "vision")

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full min-w-0 bg-white/6 text-white dark:bg-white/6 lg:w-[220px]">
        <SelectValue placeholder="选择模型" />
      </SelectTrigger>
      <SelectContent className="bg-[#10203d] text-white">
        <SelectGroup>
          <SelectLabel>文本问诊</SelectLabel>
          {textModels.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              {model.name}
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>图片问诊</SelectLabel>
          {visionModels.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              {model.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
