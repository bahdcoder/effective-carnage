import { getEventCoverImage } from "@/app/pages/events/helpers/get-event-cover-image.helper";
import { Button } from "@/app/ui/button";
import type { Event } from "@prisma/client";

export interface EventCardProps {
	event: Event;
	onSelect?: (event: Event) => void;
}

export function EventCard({ event, onSelect }: EventCardProps) {
	return (
		<div
			style={{
				backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url(${getEventCoverImage(
					event.eventName,
				)})`,
			}}
			className="w-full bg-cover group relative rounded-xl bg-center h-48 border border-border hover:border-primary transition ease-linear cursor-pointer transform hover:scale-105"
		>
			<p className="text-sm p-4">{event?.eventName}</p>
			<div className="flex justify-between px-4 h-12 items-center absolute bottom-4 w-full">
				<p className="text-foreground font-bold">{event?.odds?.toString()}</p>
				<Button
					onClick={() => onSelect?.(event)}
					className="hidden group-hover:block"
				>
					Place a bet
				</Button>
			</div>
		</div>
	);
}
