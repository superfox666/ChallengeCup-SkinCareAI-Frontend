function withBase(path: string) {
  const base = import.meta.env.BASE_URL || "/"
  const normalizedBase = base.endsWith("/") ? base : `${base}/`

  return `${normalizedBase}${path}`.replace(/\/{2,}/g, "/")
}

export const brandAiAvatarSrc = withBase("brand/ai-avatar.png")
export const brandShowcaseSrc = withBase("brand/brand-showcase.png")
