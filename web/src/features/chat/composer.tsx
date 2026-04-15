import { useId, useMemo, useState } from "react"
import { ImagePlusIcon, SendHorizonalIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { InfoHint } from "@/components/ui/info-hint"
import { Textarea } from "@/components/ui/textarea"
import { getModelDisplayName } from "@/lib/model-config"
import type { ComposerPayload, ImageAttachment, ModelDefinition } from "@/types/chat"

import { UploadPreview } from "@/features/chat/upload-preview"

interface ComposerProps {
  model: ModelDefinition
  defaultGeneralModel?: ModelDefinition | null
  busy: boolean
  compact?: boolean
  notice: string | null
  initialDraft?: ComposerPayload | null
  suggestedVisionModel?: ModelDefinition | null
  onSwitchToSuggestedVision?: (payload: ComposerPayload) => void
  onSubmit: (payload: ComposerPayload) => Promise<void>
}

async function createImageAttachment(file: File): Promise<ImageAttachment> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "")
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })

  return {
    id: `img-${crypto.randomUUID()}`,
    name: file.name,
    mimeType: file.type,
    previewUrl: dataUrl,
    transportDataUrl: dataUrl,
    size: file.size,
  }
}

export function Composer({
  model,
  defaultGeneralModel,
  busy,
  compact = false,
  notice,
  initialDraft,
  suggestedVisionModel,
  onSwitchToSuggestedVision,
  onSubmit,
}: ComposerProps) {
  const inputId = useId()
  const [text, setText] = useState(initialDraft?.text ?? "")
  const [image, setImage] = useState<ImageAttachment | null>(initialDraft?.image ?? null)
  const [isComposing, setIsComposing] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

  const helperText = useMemo(() => {
    if (notice) {
      return notice
    }

    if (image && !model.supportsImageInput) {
      return `当前模型不支持图片分析，推荐切换到 ${suggestedVisionModel?.displayName || suggestedVisionModel?.name || "视觉模型"}。`
    }

    if (model.supportsImageInput) {
      return "当前模型支持图片 + 文字联合提交。"
    }

    return "当前模型为文本问诊模型；如果附带图片，系统会自动切到视觉模型。"
  }, [
    image,
    model.supportsImageInput,
    notice,
    suggestedVisionModel?.displayName,
    suggestedVisionModel?.name,
  ])

  const canSubmit = !busy && (text.trim().length > 0 || image !== null)

  const handleIncomingFile = async (file: File) => {
    const attachment = await createImageAttachment(file)
    setImage(attachment)
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    await handleIncomingFile(file)
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
    <div
      className={[
        "surface-composer app-surface rounded-[28px] border border-border/70 shadow-[var(--surface-shadow-soft)] transition-colors",
        compact ? "p-3.5" : "p-4",
        isDragOver ? "border-primary/50" : "",
      ].join(" ")}
      onDragOver={(event) => {
        event.preventDefault()
        setIsDragOver(true)
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(event) => {
        event.preventDefault()
        setIsDragOver(false)
        const file = event.dataTransfer.files?.[0]
        if (file) {
          void handleIncomingFile(file)
        }
      }}
      onPaste={(event) => {
        const file = Array.from(event.clipboardData.files || [])[0]
        if (file) {
          void handleIncomingFile(file)
        }
      }}
    >
      <div className="flex flex-col gap-4">
        {image ? (
          <UploadPreview image={image} onRemove={() => setImage(null)} />
        ) : null}

        <div className="flex flex-wrap gap-2 text-xs">
          <BadgeText label="当前模型" value={getModelDisplayName(model)} />
          {defaultGeneralModel && defaultGeneralModel.id !== model.id ? (
            <BadgeText label="不会选时可回到" value={getModelDisplayName(defaultGeneralModel)} />
          ) : null}
        </div>

        <Textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            void handleKeyDown(event)
          }}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          placeholder="描述你的皮肤问题，或结合图片补充细节…"
          className={[
            "surface-input resize-none border-border/70 px-4 text-base leading-7 text-foreground placeholder:text-muted-foreground",
            compact ? "min-h-24 rounded-[22px] py-3.5" : "min-h-32 rounded-[24px] py-4",
          ].join(" ")}
          disabled={busy}
        />

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <input
              id={inputId}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                void handleFileChange(event)
              }}
            />
            <Button
              asChild
              type="button"
              variant="outline"
              className="rounded-2xl border-border/70 bg-background/70 text-foreground hover:bg-muted"
            >
              <label htmlFor={inputId}>
                <ImagePlusIcon data-icon="inline-start" />
                上传图片
              </label>
            </Button>
            <InfoHint
              label="图片上传与 handoff"
              content="支持点击上传、粘贴上传和拖拽上传。若当前模型不支持图片，系统会推荐并切到视觉模型的新会话，保证一个模型一个会话的规则不被破坏。"
              align="start"
            />
            <p className="text-sm text-muted-foreground">{helperText}</p>
            {image && !model.supportsImageInput && suggestedVisionModel && onSwitchToSuggestedVision ? (
              <Button
                type="button"
                variant="outline"
                className="rounded-2xl border-primary/30 bg-primary/10 text-foreground hover:bg-primary/16"
                onClick={() =>
                  onSwitchToSuggestedVision({
                    text,
                    image,
                  })
                }
              >
                切换到 {suggestedVisionModel.displayName || suggestedVisionModel.name}
              </Button>
            ) : null}
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

function BadgeText({ label, value }: { label: string; value: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-muted-foreground">
      <span>{label}：</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  )
}
