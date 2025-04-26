import { useApiClient } from "@/app/state/api-client-state.js"
import type { ServerResponse } from "@/modules/http/types/server-response.types.js"
import type { User } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

export type SessionStateUser = Omit<User, "password">

export type UseRefreshSessionStateQueryProps = {
	initialData?: SessionStateUser | null
}

export function useRefreshSessionStateQuery({
	initialData,
}: UseRefreshSessionStateQueryProps) {
	const { apiClient } = useApiClient()

	return useQuery<SessionStateUser>({
		queryKey: ["users/sessionState"],
		initialData: initialData || undefined,
		async queryFn() {
			const response = await apiClient.get<ServerResponse>("/users")

			return response.data.data as SessionStateUser
		},
	})
}
