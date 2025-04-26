import { StrictMode } from "react"
import {
  type RenderToPipeableStreamOptions,
  renderToPipeableStream,
} from "react-dom/server"
import { Root } from "../app/root"
import type { SessionState } from "../app/state/session-state"

interface ServerRenderOptions extends RenderToPipeableStreamOptions {
  sessionState?: SessionState
}

export function render(_url: string, options?: ServerRenderOptions) {
  const { sessionState = {}, ...streamOptions } = options || {}

  return renderToPipeableStream(
    <StrictMode>
      <Root sessionState={sessionState} />
    </StrictMode>,
    streamOptions
  )
}
