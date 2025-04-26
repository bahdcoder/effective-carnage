import { LoginSignupFlow } from "@/app/flows/auth/login-signup.flow"
import { EventsPage } from "@/app/pages/events/events.page"
import { useSession } from "@/app/state/session-state"
import { Button } from "@/app/ui/button"
import { Toaster } from "@app/ui/sonner"

export function RootLayout() {
	const { user, destroySessionState, dialog } = useSession()

	return (
		<>
			<main className="w-full">
				<div className="w-full border border-b py-4">
					<header className="max-w-6xl mx-auto px-6 lg:px-0 flex items-center justify-between">
						<img src="/logo.svg" alt="betting platform logo" />

						<div className="flex items-center gap-4">
							{user ? (
								<>
									<p className="text-foreground">Hey, {user?.email}</p>
									<Button variant="secondary" onClick={destroySessionState}>
										Logout
									</Button>
								</>
							) : (
								<LoginSignupFlow {...dialog}>
									<Button>Login or sign up</Button>
								</LoginSignupFlow>
							)}
						</div>
					</header>
				</div>
				<EventsPage />
			</main>
			<Toaster />
		</>
	)
}
