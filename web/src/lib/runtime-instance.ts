export const runtimeBuildId = "skin-runtime-2026-04-17-r1"

const runtimeStartedAt = new Date().toISOString()

declare global {
  interface Window {
    __SKINCAREAI_RUNTIME__?: Record<string, unknown>
  }
}

function applyRuntimeAttributes() {
  const root = document.getElementById("root")

  root?.setAttribute("data-build-id", runtimeBuildId)
  root?.setAttribute("data-runtime-mode", import.meta.env.DEV ? "dev" : "prod")
  document.documentElement.setAttribute("data-build-id", runtimeBuildId)
}

export function initRuntimeFingerprint() {
  applyRuntimeAttributes()

  if (!import.meta.env.DEV) {
    return
  }

  publishRuntimeSnapshot({
    event: "boot",
    route: window.location.pathname,
    href: window.location.href,
  })
}

export function publishRuntimeSnapshot(payload: Record<string, unknown>) {
  if (!import.meta.env.DEV) {
    return
  }

  applyRuntimeAttributes()

  const nextSnapshot = {
    buildId: runtimeBuildId,
    startedAt: runtimeStartedAt,
    ...payload,
  }

  window.__SKINCAREAI_RUNTIME__ = {
    ...(window.__SKINCAREAI_RUNTIME__ ?? {}),
    ...nextSnapshot,
  }

  console.info("[SkinCareAI runtime]", window.__SKINCAREAI_RUNTIME__)
}
