import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { CircleHelpIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface InfoHintProps {
  label: string
  content: string
  className?: string
  panelClassName?: string
  align?: "start" | "center" | "end"
}

const PANEL_WIDTH = 288
const VIEWPORT_PADDING = 12

export function InfoHint({
  label,
  content,
  className,
  panelClassName,
  align = "end",
}: InfoHintProps) {
  const [open, setOpen] = useState(false)
  const [isCompactViewport, setIsCompactViewport] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [placement, setPlacement] = useState<"top" | "bottom">("bottom")
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 639px)")
    const updateViewportMode = () => setIsCompactViewport(mediaQuery.matches)

    updateViewportMode()
    mediaQuery.addEventListener("change", updateViewportMode)

    return () => mediaQuery.removeEventListener("change", updateViewportMode)
  }, [])

  useEffect(() => {
    function updatePosition() {
      if (!open || !buttonRef.current || isCompactViewport) {
        return
      }

      const rect = buttonRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const estimatedHeight = panelRef.current?.offsetHeight ?? 156

      let left =
        align === "start"
          ? rect.left
          : align === "center"
            ? rect.left + rect.width / 2 - PANEL_WIDTH / 2
            : rect.right - PANEL_WIDTH

      left = Math.min(
        Math.max(left, VIEWPORT_PADDING),
        viewportWidth - PANEL_WIDTH - VIEWPORT_PADDING
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
  }, [align, isCompactViewport, open])

  return (
    <div className={cn("inline-flex shrink-0", className)}>
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        aria-expanded={open}
        className={cn(
          "inline-flex size-8 items-center justify-center rounded-full border border-border/70 bg-background/75 text-muted-foreground transition-colors hover:border-primary/35 hover:bg-primary/10 hover:text-primary",
          open ? "border-primary/35 bg-primary/10 text-primary" : ""
        )}
        onClick={() => setOpen((current) => !current)}
      >
        <CircleHelpIcon className="size-4" />
      </button>

      {open
        ? createPortal(
            isCompactViewport ? (
              <div className="fixed inset-0 z-[80] sm:hidden">
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
                    "surface-panel absolute inset-x-3 bottom-3 rounded-[24px] border border-border/70 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] text-left shadow-[var(--surface-shadow-strong)]",
                    panelClassName
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{label}</p>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">{content}</p>
                    </div>
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
                role="dialog"
                aria-modal="false"
                aria-label={label}
                className={cn(
                  "surface-panel fixed z-[80] w-72 rounded-[22px] border border-border/70 p-4 text-left shadow-[var(--surface-shadow-strong)]",
                  placement === "top" ? "-translate-y-full" : "",
                  panelClassName
                )}
                style={{
                  left: `${position.left}px`,
                  top: `${position.top}px`,
                }}
              >
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{content}</p>
              </div>
            ),
            document.body
          )
        : null}
    </div>
  )
}
