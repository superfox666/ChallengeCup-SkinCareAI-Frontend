import { useId, useMemo, useState, type ChangeEvent, type KeyboardEvent } from "react"
import { ChevronDownIcon, ChevronUpIcon, ImagePlusIcon, SendHorizonalIcon, SlidersHorizontalIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { InfoHint } from "@/components/ui/info-hint"
import { Textarea } from "@/components/ui/textarea"
import { UploadPreview } from "@/features/chat/upload-preview"
import { getModelDisplayName } from "@/lib/model-config"
import { getTonePresetLabel, getTonePresetShortLabel, tonePresetOptions } from "@/lib/tone-preset"
import { useUiStore } from "@/stores/use-ui-store"
import type { ComposerPayload, ImageAttachment, ModelDefinition } from "@/types/chat"

interface ComposerProps {
  model: ModelDefinition
  defaultGeneralModel?: ModelDefinition | null
  busy: boolean
  compact?: boolean
  notice: string | null
  initialDraft?: ComposerPayload | null
  suggestedVisionModel?: ModelDefinition | null
  onDraftChange?: (payload: ComposerPayload) => void
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
  onDraftChange,
  onSwitchToSuggestedVision,
  onSubmit,
}: ComposerProps) {
  const inputId = useId()
  const [text, setText] = useState(initialDraft?.text ?? "")
  const [image, setImage] = useState<ImageAttachment | null>(initialDraft?.image ?? null)
  const [isComposing, setIsComposing] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const tonePreset = useUiStore((state) => state.tonePreset)
  const setTonePreset = useUiStore((state) => state.setTonePreset)
  const showAdvancedComposerTools = useUiStore((state) => state.showAdvancedComposerTools)
  const toggleAdvancedComposerTools = useUiStore((state) => state.toggleAdvancedComposerTools)

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
  const helperSummary = image && !model.supportsImageInput
    ? "带图会自动切换到视觉模型"
    : model.supportsImageInput
      ? "支持图文联合提交"
      : "当前为文本问诊模型"
  const noticeSummary = notice
    ? notice.replace(/\s+/g, " ").trim().slice(0, 54)
    : null

  const emitDraftChange = (nextText: string, nextImage: ImageAttachment | null) => {
    onDraftChange?.({
      text: nextText,
      image: nextImage,
    })
  }

  const handleIncomingFile = async (file: File) => {
    const attachment = await createImageAttachment(file)
    setImage(attachment)
    emitDraftChange(text, attachment)
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
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
    emitDraftChange("", null)
  }

  const handleKeyDown = async (event: KeyboardEvent<HTMLTextAreaElement>) => {
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
        compact ? "p-2.5" : "p-3",
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
      <div className="flex flex-col gap-2.5">
        {image ? (
          <UploadPreview
            image={image}
            onRemove={() => {
              setImage(null)
              emitDraftChange(text, null)
            }}
          />
        ) : null}

        <div className="flex flex-wrap gap-1.5 text-[11px]">
          <BadgeText label="当前模型" value={getModelDisplayName(model)} />
          {defaultGeneralModel && defaultGeneralModel.id !== model.id ? (
            <BadgeText label="默认入口" value={getModelDisplayName(defaultGeneralModel)} />
          ) : null}
          <BadgeText label="回复语气" value={getTonePresetShortLabel(tonePreset)} />
          {noticeSummary ? (
            <span className="notice-pill rounded-full px-3 py-1">
              {noticeSummary}
            </span>
          ) : null}
        </div>

        <Textarea
          value={text}
          onChange={(event) => {
            const nextText = event.target.value
            setText(nextText)
            emitDraftChange(nextText, image)
          }}
          onKeyDown={(event) => {
            void handleKeyDown(event)
          }}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          placeholder="描述你的皮肤问题，或结合图片补充部位、时长和主要感受…"
          className={[
            "surface-input resize-none border-border/70 px-4 text-base leading-7 text-foreground placeholder:text-muted-foreground",
            compact
              ? "min-h-16 max-h-28 rounded-[20px] py-2.5"
              : "min-h-20 max-h-36 rounded-[22px] py-3",
          ].join(" ")}
          disabled={busy}
        />

        {showAdvancedComposerTools ? (
          <div className="surface-panel-muted rounded-[20px] border border-border/70 px-3 py-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-foreground">高级设置</p>
                <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                  当前语气：{getTonePresetLabel(tonePreset)}。只影响模型回答风格，不改用户原始输入展示。
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="rounded-full"
                onClick={toggleAdvancedComposerTools}
              >
                <ChevronUpIcon data-icon="inline-start" />
                收起
              </Button>
            </div>

            <div className="mt-2.5 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {tonePresetOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={[
                    "rounded-[16px] border px-3 py-2.5 text-left transition-colors",
                    tonePreset === option.id
                      ? "border-primary/35 bg-primary/12 text-foreground"
                      : "border-border/70 bg-background/65 text-foreground hover:border-primary/20 hover:bg-muted/60",
                  ].join(" ")}
                  onClick={() => setTonePreset(option.id)}
                >
                  <div className="text-sm font-medium">{option.label}</div>
                  <p className="mt-1 text-[11px] leading-5 text-muted-foreground">{option.description}</p>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
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
              size="sm"
              className="rounded-2xl border-border/70 bg-background/70 text-foreground hover:bg-muted"
            >
              <label htmlFor={inputId}>
                <ImagePlusIcon data-icon="inline-start" />
                上传图片
              </label>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-2xl border-border/70 bg-background/70 text-foreground hover:bg-muted"
              onClick={toggleAdvancedComposerTools}
            >
              <SlidersHorizontalIcon data-icon="inline-start" />
              高级设置
              {showAdvancedComposerTools ? <ChevronUpIcon data-icon="inline-end" /> : <ChevronDownIcon data-icon="inline-end" />}
            </Button>
            <InfoHint
              label="图片上传与 handoff"
              content="支持点击上传、粘贴上传和拖拽上传。\n\n如果当前模型不支持图片，系统会自动推荐并切换到视觉模型的新会话，避免把图片请求直接发到纯文本模型。"
              mode="popover"
              align="start"
            />
            <span className="rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs text-muted-foreground">
              {helperSummary}
            </span>
            <InfoHint
              label="输入说明"
              content={helperText}
              mode="popover"
              align="start"
            />
            {image && !model.supportsImageInput && suggestedVisionModel && onSwitchToSuggestedVision ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
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
            size="default"
            onClick={() => {
              void handleSubmit()
            }}
            disabled={!canSubmit}
            className="h-10 rounded-2xl px-4 shadow-[0_18px_40px_rgba(38,198,190,0.24)]"
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
    <div className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/70 px-2.5 py-1 text-muted-foreground">
      <span>{label}：</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  )
}
