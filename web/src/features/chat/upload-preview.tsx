import { XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { ImageAttachment } from "@/types/chat"

interface UploadPreviewProps {
  image: ImageAttachment
  onRemove: () => void
}

export function UploadPreview({ image, onRemove }: UploadPreviewProps) {
  return (
    <div className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-white/5 p-3">
      {image.previewUrl ? (
        <img
          src={image.previewUrl}
          alt={image.name}
          className="size-16 rounded-[16px] object-cover"
        />
      ) : (
        <div className="flex size-16 items-center justify-center rounded-[16px] bg-white/8 text-xs text-slate-300">
          预览缺失
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{image.name}</p>
        <p className="text-xs text-slate-400">
          {(image.size / 1024).toFixed(0)} KB · 单图上传
        </p>
      </div>
      <Button type="button" variant="ghost" size="icon-sm" onClick={onRemove}>
        <XIcon />
      </Button>
    </div>
  )
}
