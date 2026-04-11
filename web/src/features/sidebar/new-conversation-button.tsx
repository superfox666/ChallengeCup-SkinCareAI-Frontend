import { PenSquareIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

interface NewConversationButtonProps {
  onCreate: () => void
}

export function NewConversationButton({ onCreate }: NewConversationButtonProps) {
  return (
    <Button
      type="button"
      size="lg"
      className="h-11 w-full justify-center rounded-2xl shadow-[0_18px_40px_rgba(38,198,190,0.28)]"
      onClick={onCreate}
    >
      <PenSquareIcon data-icon="inline-start" />
      新建对话
    </Button>
  )
}
