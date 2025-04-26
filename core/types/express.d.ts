import type { SessionState } from "@/app/state/session-state.js"

declare global {
	namespace Express {
		interface Request {
			session?: SessionState | null
		}
	}
}
