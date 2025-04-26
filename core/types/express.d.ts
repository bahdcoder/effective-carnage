import { SessionData } from "@/app/state/session-state"

declare global {
  namespace Express {
    interface Request {
      session?: SessionData
    }
  }
}
