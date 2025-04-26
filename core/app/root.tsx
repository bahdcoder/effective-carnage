import "./styles/root.css"
import { SessionProvider, type SessionState } from "./state/session-state"
import { QueryClientProvider } from "./state/query-state"
import { RootLayout } from "@/app/layouts/root.layout"
import { apiClient, ApiClientProvider } from "@/app/state/api-client-state"

interface RootProps {
	sessionState?: SessionState
}

export function Root({ sessionState = {} }: RootProps) {
	return (
		<QueryClientProvider>
			<ApiClientProvider apiClient={apiClient}>
				<SessionProvider sessionState={sessionState}>
					<RootLayout />
				</SessionProvider>
			</ApiClientProvider>
		</QueryClientProvider>
	)
}
