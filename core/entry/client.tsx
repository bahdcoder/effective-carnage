import { StrictMode } from "react"
import { hydrateRoot } from "react-dom/client"
import { Root } from "../app/root"
import type { SessionState } from "../app/state/session-state"

declare global {
	interface Window {
		__SESSION_DATA__?: SessionState
	}
}

const sessionState = window.__SESSION_DATA__ || {}

hydrateRoot(
	document.getElementById("root") as HTMLElement,
	<StrictMode>
		<Root sessionState={sessionState} />
	</StrictMode>,
)
