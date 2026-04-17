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
      className="h-10.5 w-full justify-center rounded-2xl shadow-[0_18px_40px_rgba(38,198,190,0.24)]"
      onClick={onCreate}
    >
      <PenSquareIcon data-icon="inline-start" />
      新建会话
    </Button>
  )
}
