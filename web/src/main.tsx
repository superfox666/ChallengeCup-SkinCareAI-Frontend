import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import App from "@/App"
import "@/index.css"
import { initRuntimeFingerprint } from "@/lib/runtime-instance"

initRuntimeFingerprint()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
