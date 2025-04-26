import { StrictMode } from "react"
import {
  type RenderToPipeableStreamOptions,
  renderToPipeableStream,
} from "react-dom/server"
import { Root } from "../app/root"
import type { SessionData } from "../app/state/session-state"

interface ServerRenderOptions extends RenderToPipeableStreamOptions {
  sessionData?: SessionData
}

export function render(_url: string, options?: ServerRenderOptions) {
  const { sessionData = {}, ...streamOptions } = options || {}

  return renderToPipeableStream(
    <StrictMode>
      <Root sessionData={sessionData} />
    </StrictMode>,
    streamOptions
  )
}
