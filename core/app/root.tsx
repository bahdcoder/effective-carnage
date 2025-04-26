import "./root.css"
import { SessionProvider, type SessionData } from "./state/session-state"

interface RootProps {
  sessionData?: SessionData
}

export function Root({ sessionData = {} }: RootProps) {
  return (
    <SessionProvider user={sessionData?.user}>
      <h1>Hello world root</h1>
      {/* You can access session data in any component using the useSession hook */}
    </SessionProvider>
  )
}
