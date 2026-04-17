import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { CircleHelpIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export type InfoHintMode = "auto" | "tooltip" | "popover" | "sheet"

interface InfoHintProps {
  label: string
  content: string
  mode?: InfoHintMode
  className?: string
  triggerClassName?: string
  panelClassName?: string
  contentClassName?: string
  align?: "start" | "center" | "end"
}

const TOOLTIP_PANEL_WIDTH = 288
const POPOVER_PANEL_WIDTH = 360
const VIEWPORT_PADDING = 12
const LONG_CONTENT_THRESHOLD = 120

function isLongFormContent(content: string) {
  return content.length > LONG_CONTENT_THRESHOLD || content.includes("\n")
}

export function InfoHint({
  label,
  content,
  mode = "auto",
  className,
  triggerClassName,
  panelClassName,
  contentClassName,
  align = "end",
}: InfoHintProps) {
  const [open, setOpen] = useState(false)
  const [isCompactViewport, setIsCompactViewport] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [placement, setPlacement] = useState<"top" | "bottom">("bottom")
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const closeTimerRef = useRef<number | null>(null)

  const requestedDesktopMode =
    mode === "auto" ? (isLongFormContent(content) ? "popover" : "tooltip") : mode
  const resolvedMode: Exclude<InfoHintMode, "auto"> =
    isCompactViewport ? "sheet" : requestedDesktopMode
  const panelWidth = resolvedMode === "tooltip" ? TOOLTIP_PANEL_WIDTH : POPOVER_PANEL_WIDTH
  const usesHoverTrigger = !isCompactViewport && requestedDesktopMode !== "sheet"

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 639px)")
    const updateViewportMode = () => setIsCompactViewport(mediaQuery.matches)

    updateViewportMode()
    mediaQuery.addEventListener("change", updateViewportMode)

    return () => mediaQuery.removeEventListener("change", updateViewportMode)
  }, [])

  useEffect(() => {
    function updatePosition() {
      if (!open || !buttonRef.current || resolvedMode === "sheet") {
        return
      }

      const rect = buttonRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const estimatedHeight =
        panelRef.current?.offsetHeight ?? (resolvedMode === "tooltip" ? 156 : 248)

      let left =
        align === "start"
          ? rect.left
          : align === "center"
            ? rect.left + rect.width / 2 - panelWidth / 2
            : rect.right - panelWidth

      left = Math.min(
        Math.max(left, VIEWPORT_PADDING),
        viewportWidth - panelWidth - VIEWPORT_PADDING
      )

      const shouldPlaceAbove =
        rect.bottom + 12 + estimatedHeight > viewportHeight - VIEWPORT_PADDING &&
        rect.top - 12 - estimatedHeight > VIEWPORT_PADDING

      setPlacement(shouldPlaceAbove ? "top" : "bottom")
      setPosition({
        left,
        top: shouldPlaceAbove ? rect.top - 12 : rect.bottom + 12,
      })
    }

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node

      if (
        !buttonRef.current?.contains(target) &&
        !panelRef.current?.contains(target)
      ) {
        setOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false)
        buttonRef.current?.blur()
      }
    }

    updatePosition()
    window.addEventListener("resize", updatePosition)
    window.addEventListener("scroll", updatePosition, true)
    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("keydown", handleEscape)

    return () => {
      window.removeEventListener("resize", updatePosition)
      window.removeEventListener("scroll", updatePosition, true)
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [align, open, panelWidth, resolvedMode])

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current)
      }
    }
  }, [])

  const clearCloseTimer = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  const scheduleClose = () => {
    clearCloseTimer()
    closeTimerRef.current = window.setTimeout(() => {
      setOpen(false)
    }, 90)
  }

  const desktopTriggerProps = !usesHoverTrigger
    ? {}
    : {
        onMouseEnter: () => {
          clearCloseTimer()
          setOpen(true)
        },
        onMouseLeave: scheduleClose,
        onFocus: () => {
          clearCloseTimer()
          setOpen(true)
        },
        onBlur: scheduleClose,
      }

  const panelBody = (
    <div className="min-w-0">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <div
        className={cn(
          "mt-2 text-sm leading-7 text-muted-foreground whitespace-pre-line",
          resolvedMode === "tooltip"
            ? ""
            : "max-h-[min(56dvh,340px)] overflow-y-auto overscroll-contain pr-1",
          contentClassName
        )}
      >
        {content}
      </div>
    </div>
  )

  return (
    <div className={cn("inline-flex shrink-0", className)}>
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        aria-expanded={open}
        className={cn(
          "inline-flex size-8 items-center justify-center rounded-full border border-border/70 bg-background/75 text-muted-foreground transition-colors hover:border-primary/35 hover:bg-primary/10 hover:text-primary focus-visible:border-primary/35 focus-visible:bg-primary/10 focus-visible:text-primary",
          open ? "border-primary/35 bg-primary/10 text-primary" : "",
          triggerClassName
        )}
        onClick={() => setOpen((current) => !current)}
        {...desktopTriggerProps}
      >
        <CircleHelpIcon className="size-4" />
      </button>

      {open
        ? createPortal(
            resolvedMode === "sheet" ? (
              <div className="fixed inset-0 z-[80]">
                <button
                  type="button"
                  aria-label={`关闭${label}`}
                  className="absolute inset-0 bg-black/34 backdrop-blur-[1px]"
                  onClick={() => setOpen(false)}
                />
                <div
                  ref={panelRef}
                  role="dialog"
                  aria-modal="true"
                  aria-label={label}
                  className={cn(
                    "surface-panel absolute inset-x-3 bottom-3 max-h-[min(72dvh,520px)] rounded-[24px] border border-border/70 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] text-left shadow-[var(--surface-shadow-strong)] sm:inset-x-auto sm:left-1/2 sm:top-1/2 sm:bottom-auto sm:w-[min(26rem,calc(100vw-2rem))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:pb-4",
                    panelClassName
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    {panelBody}
                    <button
                      type="button"
                      aria-label="关闭帮助说明"
                      className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border/70 bg-background/70 text-muted-foreground transition-colors hover:border-primary/35 hover:text-primary"
                      onClick={() => setOpen(false)}
                    >
                      <XIcon className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                ref={panelRef}
                role={resolvedMode === "tooltip" ? "tooltip" : "dialog"}
                aria-label={label}
                className={cn(
                  "surface-panel fixed z-[80] rounded-[22px] border border-border/70 p-4 text-left shadow-[var(--surface-shadow-strong)]",
                  resolvedMode === "tooltip"
                    ? "w-72"
                    : "w-[min(22.5rem,calc(100vw-1.5rem))]",
                  placement === "top" ? "-translate-y-full" : "",
                  panelClassName
                )}
                style={{
                  left: `${position.left}px`,
                  top: `${position.top}px`,
                }}
                onMouseEnter={clearCloseTimer}
                onMouseLeave={usesHoverTrigger ? scheduleClose : undefined}
              >
                {panelBody}
              </div>
            ),
            document.body
          )
        : null}
    </div>
  )
}
