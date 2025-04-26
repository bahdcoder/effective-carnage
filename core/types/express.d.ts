import type { SessionState } from "@/app/state/session-state";

declare global {
	namespace Express {
		interface Request {
			session?: SessionState | null;
		}
	}
}
