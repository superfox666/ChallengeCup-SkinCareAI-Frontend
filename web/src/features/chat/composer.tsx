import { useId, useMemo, useState } from "react"
import { ImagePlusIcon, SendHorizonalIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { ComposerPayload, ImageAttachment, ModelDefinition } from "@/types/chat"

import { UploadPreview } from "@/features/chat/upload-preview"

interface ComposerProps {
  model: ModelDefinition
  busy: boolean
  notice: string | null
  onSubmit: (payload: ComposerPayload) => Promise<void>
}

function createImageAttachment(file: File): ImageAttachment {
  return {
    id: `img-${crypto.randomUUID()}`,
    name: file.name,
    mimeType: file.type,
    previewUrl: URL.createObjectURL(file),
    size: file.size,
  }
}

export function Composer({
  model,
  busy,
  notice,
  onSubmit,
}: ComposerProps) {
  const inputId = useId()
  const [text, setText] = useState("")
  const [image, setImage] = useState<ImageAttachment | null>(null)
  const [isComposing, setIsComposing] = useState(false)

  const helperText = useMemo(() => {
    if (notice) {
      return notice
    }

    if (image && !model.supportsImageInput) {
      return "当前模型不支持图片分析，发送后将自动切换到新的视觉模型会话。"
    }

    if (model.supportsImageInput) {
      return "当前模型支持图片 + 文字联合提交。"
    }

    return "当前模型为文本问诊模型，若附带图片将自动 handoff 到视觉模型。"
  }, [image, model.supportsImageInput, notice])

  const canSubmit = !busy && (text.trim().length > 0 || image !== null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setImage(createImageAttachment(file))
    event.target.value = ""
  }

  const handleSubmit = async () => {
    if (!canSubmit) {
      return
    }

    await onSubmit({
      text,
      image,
    })

    setText("")
    setImage(null)
  }

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key !== "Enter" ||
      event.shiftKey ||
      isComposing ||
      event.nativeEvent.isComposing
    ) {
      return
    }

    event.preventDefault()
    await handleSubmit()
  }

  return (
    <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,27,50,0.96),rgba(10,18,35,0.9))] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.18)]">
      <div className="flex flex-col gap-4">
        {image ? (
          <UploadPreview image={image} onRemove={() => setImage(null)} />
        ) : null}
        <Textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            void handleKeyDown(event)
          }}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          placeholder="描述你的皮肤问题，或结合图片补充细节…"
          className="min-h-32 resize-none rounded-[24px] border-white/10 bg-white/5 px-4 py-4 text-base leading-7 text-white placeholder:text-slate-500 focus-visible:bg-white/6"
          disabled={busy}
        />
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <input
              id={inputId}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              asChild
              type="button"
              variant="outline"
              className="rounded-2xl border-white/12 bg-white/6 text-slate-100 hover:bg-white/8"
            >
              <label htmlFor={inputId}>
                <ImagePlusIcon data-icon="inline-start" />
                上传图片
              </label>
            </Button>
            <p className="text-sm text-slate-400">{helperText}</p>
          </div>
          <Button
            type="button"
            size="lg"
            onClick={() => {
              void handleSubmit()
            }}
            disabled={!canSubmit}
            className="h-11 rounded-2xl px-5 shadow-[0_18px_40px_rgba(38,198,190,0.28)]"
          >
            <SendHorizonalIcon data-icon="inline-start" />
            {busy ? "生成中" : "发送"}
          </Button>
        </div>
      </div>
    </div>
  )
}
