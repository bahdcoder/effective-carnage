import { useDestroySessionStateMutation } from "@/app/state/hooks/destroy-session-state.mutation";
import {
	useRefreshSessionStateQuery,
	type SessionStateUser,
} from "@/app/state/hooks/refresh-session-state.query";
import * as RadixContext from "@radix-ui/react-context";
import { type PropsWithChildren, useState } from "react";

export interface SessionState {
	user?: SessionStateUser | null;
	refreshSessionState?: () => void;
	destroySessionState?: () => void;
	dialog?: {
		open: boolean;
		onOpenChange: (open: boolean) => void;
	};
}

const [SessionProviderInternal, useSessionContext] =
	RadixContext.createContext<SessionState>("SessionContext");

export interface SessionProviderProps {
	sessionState?: SessionState;
}

export function SessionProvider({
	sessionState,
	children,
}: PropsWithChildren<SessionProviderProps>) {
	const [open, onOpenChange] = useState(false);
	const { refetch: refreshSessionState, data } = useRefreshSessionStateQuery({
		initialData: sessionState?.user || null,
	});

	const { mutate } = useDestroySessionStateMutation({
		onSuccess() {
			refreshSessionState();
		},
	});

	return (
		<SessionProviderInternal
			user={data}
			destroySessionState={mutate}
			refreshSessionState={refreshSessionState}
			dialog={{ open, onOpenChange }}
		>
			{children}
		</SessionProviderInternal>
	);
}

export function useSession() {
	return useSessionContext("useSession");
}
