import { useApiClient } from "@/app/state/api-client-state";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { ServerResponse } from "@/modules/http/types/server-response.types";
import { toast } from "sonner";

export type AuthFlowMode = "signup" | "login";

export type UseDestroySessionStateMutationProps = {
	onSuccess?:
		| ((
				data: AxiosResponse<ServerResponse>,
				variables: undefined,
				context: unknown,
		  ) => Promise<unknown> | unknown)
		| undefined;
};

export function useDestroySessionStateMutation({
	onSuccess,
}: UseDestroySessionStateMutationProps) {
	const { apiClient } = useApiClient();

	return useMutation<
		AxiosResponse<ServerResponse, undefined>,
		AxiosError<ServerResponse>
	>({
		async mutationFn() {
			return apiClient.delete("/users");
		},
		onSuccess(response) {
			onSuccess?.(response, undefined, undefined);

			toast.success("Successfully logged out.");
		},
	});
}
