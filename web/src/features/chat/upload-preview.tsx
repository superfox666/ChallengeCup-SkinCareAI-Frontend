import { ImageIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { ImageAttachment } from "@/types/chat"

interface UploadPreviewProps {
  image: ImageAttachment
  onRemove: () => void
}

export function UploadPreview({ image, onRemove }: UploadPreviewProps) {
  return (
    <div className="surface-panel-muted flex items-center gap-2 rounded-[18px] border border-border/70 px-2 py-1.5">
      {image.previewUrl ? (
        <img
          src={image.previewUrl}
          alt={image.name}
          className="size-10 shrink-0 rounded-[12px] object-cover"
        />
      ) : (
        <div className="flex size-10 shrink-0 items-center justify-center rounded-[12px] bg-background/80 text-muted-foreground">
          <ImageIcon className="size-4" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium text-foreground">{image.name}</p>
        <p className="text-[10px] leading-4 text-muted-foreground">
          {(image.size / 1024).toFixed(0)} KB · 已附图，发送时会一并保留
        </p>
      </div>

      <Button type="button" variant="ghost" size="icon-sm" onClick={onRemove} aria-label="移除图片">
        <XIcon />
      </Button>
    </div>
  )
}
