import { useApiClient } from "@/app/state/api-client-state";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import type { ServerResponse } from "@/modules/http/types/server-response.types";
import type { AxiosError, AxiosResponse } from "axios";

export type UsePlaceBetMutationProps = {
	onSuccess?:
		| ((
				data: unknown,
				variables: unknown,
				context: unknown,
		  ) => Promise<unknown> | unknown)
		| undefined;
	eventId: string;
};

export function usePlaceBetMutation({
	eventId,
	onSuccess,
}: UsePlaceBetMutationProps) {
	const { apiClient } = useApiClient();
	return useMutation<AxiosResponse<ServerResponse>, AxiosError<ServerResponse>>(
		{
			async mutationFn() {
				return apiClient.post(`/events/${eventId}/bets`);
			},
			onSuccess(...args) {
				toast.success("Successfully placed bet.");

				onSuccess?.(...args);
			},
		},
	);
}
