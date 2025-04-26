import { useApiClient } from "@/app/state/api-client-state";
import { useQuery } from "@tanstack/react-query";
import type { Event } from "@prisma/client";

export function useEventsQuery() {
	const { apiClient } = useApiClient();

	return useQuery<Event[]>({
		queryKey: ["events/all"],
		async queryFn() {
			const response = await apiClient.get("/events");

			return response.data.data as Event[];
		},
	});
}
