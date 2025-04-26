import {
	QueryClient,
	QueryClientProvider as DefualtQueryClientProvider,
} from "@tanstack/react-query"
import type { PropsWithChildren } from "react"

const queryClient = new QueryClient()

export function QueryClientProvider({ children }: PropsWithChildren) {
	return (
		<DefualtQueryClientProvider client={queryClient}>
			{children}
		</DefualtQueryClientProvider>
	)
}
