import { getEventCoverImage } from "@/app/pages/events/helpers/get-event-cover-image.helper"
import type { Event } from "@prisma/client"
import {
	DialogContent,
	DialogDescription,
	DialogTitle,
	Dialog,
	DialogHeader,
} from "@app/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { useSession } from "@/app/state/session-state"
import { Button } from "@/app/ui/button"
import { usePlaceBetMutation } from "@/app/pages/events/hooks/use-place-bet.mutation"
import {
	ServerErrorMessage,
	ValidationErrorsForField,
} from "@/app/components/validation-errors"
import { useGetAssetsPath } from "@/app/hooks/use-get-assets-path.hooks"
import { Input } from "@/app/ui/input"

export interface PlaceBetDialogProps {
	event?: Event | null
	open?: boolean
	onOpenChange?: (open: boolean) => void
}

export function PlaceBetDialog({
	event,
	open,
	onOpenChange,
}: PlaceBetDialogProps) {
	const { user, dialog: sessionDialog } = useSession()

	const getAssetsPath = useGetAssetsPath()

	const { mutate, isPending, error } = usePlaceBetMutation({
		eventId: event?.id || "",
		onSuccess() {
			onOpenChange?.(false)
		},
	})

	function onLoginToPlaceBet() {
		onOpenChange?.(false)
		sessionDialog?.onOpenChange(true)
	}

	function onPlaceBetFormSubmitted(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()

		const payload = Object.fromEntries(new FormData(event.currentTarget))

		mutate({
			amount: payload.amount as string,
		})
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="p-0 overflow-hidden">
				<DialogHeader>
					<VisuallyHidden>
						<DialogTitle> {event?.eventName}</DialogTitle>
						<DialogDescription>
							Place a bet on {event?.eventName}
						</DialogDescription>
					</VisuallyHidden>
				</DialogHeader>

				<div className="-mt-4">
					{event ? (
						<div className="relative w-full overflow-hidden">
							<img
								src={getAssetsPath(getEventCoverImage(event.eventName))}
								alt={event.eventName}
								className="w-full object-cover"
							/>
							<div className="absolute w-full h-full bg-black/30 top-0 left-0 z-1" />
						</div>
					) : null}

					<div className="w-full p-6">{event?.eventName}</div>

					<div className="px-6">
						<ServerErrorMessage response={error?.response?.data} />
					</div>

					<div className="w-full flex justify-center pb-8 px-6">
						{user ? (
							<form
								method="post"
								onSubmit={onPlaceBetFormSubmitted}
								className="w-full grid grid-cols-1 gap-4"
							>
								<div className="flex flex-col gap-2">
									<Input name="amount" type="number" placeholder="Example: 5" />
									<ValidationErrorsForField
										field="amount"
										response={error?.response?.data}
									/>
								</div>
								<Button className="w-full" loading={isPending} type="submit">
									Place bet - odds : {event?.odds?.toString()}
								</Button>
							</form>
						) : (
							<Button className="w-full" onClick={onLoginToPlaceBet}>
								Login to place bet
							</Button>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
