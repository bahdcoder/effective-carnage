import { useApiClient } from "@/app/state/api-client-state";
import { useMutation } from "@tanstack/react-query";
import type { Prisma } from "@prisma/client";
import type { AxiosError, AxiosResponse } from "axios";
import type { ServerResponse } from "@/modules/http/types/server-response.types";
import { useSession } from "@/app/state/session-state";
import { toast } from "sonner";

export type AuthFlowMode = "signup" | "login";

export type MutationPayload = {
	payload: Prisma.UserCreateInput;
	mode: AuthFlowMode;
};

export type UseLoginSignupMutationProps = {
	onSuccess?:
		| ((
				data: AxiosResponse<ServerResponse, Prisma.UserCreateInput>,
				variables: MutationPayload,
				context: unknown,
		  ) => Promise<unknown> | unknown)
		| undefined;
};

export function useLoginSignupMutation({
	onSuccess,
}: UseLoginSignupMutationProps) {
	const { apiClient } = useApiClient();
	const { refreshSessionState } = useSession();

	return useMutation<
		AxiosResponse<ServerResponse, MutationPayload["payload"]>,
		AxiosError<ServerResponse>,
		MutationPayload
	>({
		async mutationFn({ payload, mode }) {
			if (mode === "login") {
				return apiClient.put("/users", payload);
			}

			return apiClient.post("/users", payload);
		},
		onSuccess(response, payload) {
			refreshSessionState?.();

			onSuccess?.(response, payload, undefined);

			toast.success(
				`Successfully ${payload.mode === "login" ? "logged in" : "signed up"}.`,
			);
		},
	});
}
