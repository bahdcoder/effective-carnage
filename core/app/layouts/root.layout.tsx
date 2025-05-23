import { LoginSignupFlow } from "@/app/flows/auth/login-signup.flow"
import { useGetAssetsPath } from "@/app/hooks/use-get-assets-path.hooks"
import { EventsPage } from "@/app/pages/events/events.page"
import { useSession } from "@/app/state/session-state"
import { Button } from "@/app/ui/button"
import { Toaster } from "@app/ui/sonner"

export function RootLayout() {
	const { user, destroySessionState, dialog } = useSession()

	const getAssetsPath = useGetAssetsPath()

	return (
		<>
			<main className="w-full">
				<div className="w-full border border-b py-4">
					<header className="max-w-6xl mx-auto px-6 lg:px-0 flex flex-col gap-2 lg:gap-0 lg:flex-row lg:items-center lg:justify-between">
						<img
							src={getAssetsPath("/logo.svg")}
							className="max-w-32 lg:w-auto"
							alt="betting platform logo"
						/>

						<div className="flex flex-col lg:flex-row gap-2 lg:items-center lg:gap-4">
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
