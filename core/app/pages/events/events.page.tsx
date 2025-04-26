import { EventCard } from "@/app/pages/events/components/event-card"
import { PlaceBetDialog } from "@/app/pages/events/components/place-bet-dialog"
import { useEventsQuery } from "@/app/pages/events/hooks/use-events.query"
import type { Event } from "@prisma/client"
import { LoaderCircle } from "lucide-react"
import { useState } from "react"

export function EventsPage() {
  const { data, isPending, isError } = useEventsQuery()

  const [selectedEvent, onSelectEvent] = useState<Event | null>(null)

  if (isPending) {
    return (
      <div className="w-full flex items-center flex-col justify-center py-12">
        <LoaderCircle className="animate-spin repeat-infinite w-8 h-8 duration-100 text-foreground" />

        <p className="text-sm text-foreground mt-4">
          Loading betting events...
        </p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="mx-auto w-full flex items-center flex-col justify-center py-12 max-w-sm">
        <p className="text-sm mt-4 text-center text-red-500">
          An error occurred while loading events. Please refresh the page and
          try again. If this persists, please contact support.
        </p>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="mx-auto w-full flex items-center flex-col justify-center py-12 max-w-sm">
        <p className="text-center mt-4 text-sm text-foreground">
          No events found. Please try again later, or run the{" "}
          <code>npm run cli seed_events</code> command locally to generate some
          events.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 px-6 lg:px-0 pb-6 lg:grid-cols-4 gap-6 mx-auto max-w-6xl pt-12">
      {data?.map((event) => (
        <EventCard key={event.id} event={event} onSelect={onSelectEvent} />
      ))}

      <PlaceBetDialog
        event={selectedEvent}
        open={selectedEvent !== null}
        onOpenChange={() => onSelectEvent(null)}
      />
    </div>
  )
}
