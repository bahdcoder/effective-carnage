import type { User } from "@prisma/client"
import * as RadixContext from "@radix-ui/react-context"

export interface SessionData {
  user?: User
}

export const [SessionProvider, useSessionContext] =
  RadixContext.createContext<SessionData>("SessionContext")

export function useSession() {
  return useSessionContext("useSession")
}
