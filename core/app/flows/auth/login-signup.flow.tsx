import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/app/ui/dialog"
import { type PropsWithChildren, useState } from "react"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Input } from "@/app/ui/input"
import { Label } from "@/app/ui/label"
import { Button } from "@/app/ui/button"
import {
	type AuthFlowMode,
	type MutationPayload,
	useLoginSignupMutation,
} from "@/app/flows/auth/hooks/use-login-signup.mutation"
import {
	ServerErrorMessage,
	ValidationErrorsForField,
} from "@/app/components/validation-errors"
import { useGetAssetsPath } from "@/app/hooks/use-get-assets-path.hooks"

export interface LoginSignupFlowProps {
	mode?: AuthFlowMode
	open?: boolean
	onOpenChange?: (open: boolean) => void
}

export const flowText: Record<
	AuthFlowMode,
	Record<
		| "title"
		| "description"
		| "cta"
		| "alternativeCta"
		| "alternativeCtaDescription"
		| "terms",
		string
	>
> = {
	signup: {
		title: "Create a free account",
		description: "To place bets, you must create a free account",
		cta: "Create free account",
		alternativeCta: "Log in instead",
		alternativeCtaDescription: "Already have an account ?",
		terms:
			"By signing up, I agree to the terms and conditions of this betting platform.",
	},
	login: {
		title: "Log in to your account",
		description: "To place bets, you must log in to your account",
		cta: "Log in",
		alternativeCta: "Create a free account",
		alternativeCtaDescription: "Don't have an account ?",
		terms:
			"By logging in, I agree to the terms and conditions of this betting platform.",
	},
}

export function LoginSignupFlow({
	children,
	open,
	onOpenChange,
	mode: defaultMode = "signup",
}: PropsWithChildren<LoginSignupFlowProps>) {
	const [mode, setMode] = useState<AuthFlowMode>(defaultMode)

	const getAssetPath = useGetAssetsPath()

	const { mutate, isPending, error, reset } = useLoginSignupMutation({
		onSuccess() {
			onOpenChange?.(false)
		},
	})

	const text = flowText[mode]

	function onToggleMode() {
		setMode((current) => (current === "login" ? "signup" : "login"))

		reset()
	}

	function onFormSubmit(event: React.FormEvent<HTMLFormElement>) {
		const payload = Object.fromEntries(
			new FormData(event.currentTarget),
		) as unknown as MutationPayload["payload"]

		event.preventDefault()

		mutate({ payload, mode })
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<VisuallyHidden>
						<DialogTitle>{text.title}</DialogTitle>
						<DialogDescription>{text.description}</DialogDescription>
					</VisuallyHidden>
				</DialogHeader>

				<form className="flex flex-col w-full" onSubmit={onFormSubmit}>
					<div className="flex justify-center mb-4">
						<img src={getAssetPath("/logo.svg")} alt="betting platform logo" />
					</div>

					<p className="text-sm text-center">{text.title}</p>

					<div className="mt-8 flex flex-col w-full">
						<div className="flex flex-col gap-2 mb-6">
							<Label htmlFor="email">Email address</Label>
							<Input
								placeholder="sports@gamdom.com"
								id="email"
								name="email"
								type="email"
							/>
							<ValidationErrorsForField
								field="email"
								response={error?.response?.data}
							/>
						</div>

						<div className="flex flex-col gap-2 mb-6">
							<Label htmlFor="password">Password</Label>
							<Input
								placeholder="sports@gamdom.com"
								id="password"
								name="password"
								type="password"
							/>
							<ValidationErrorsForField
								field="password"
								response={error?.response?.data}
							/>
						</div>

						<Button className="w-full mb-3" loading={isPending}>
							{text.cta}
						</Button>

						<ServerErrorMessage response={error?.response?.data} />

						<div className="flex items-center justify-center mb-8">
							<p className="text-sm">{text.alternativeCtaDescription}</p>
							<Button type="button" variant="link" onClick={onToggleMode}>
								{text.alternativeCta}
							</Button>
						</div>

						<div>
							<p className="text-muted-foreground text-center text-xs">
								{text.terms}
							</p>
						</div>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
