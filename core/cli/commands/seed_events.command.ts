import { IgnitorCli } from "@/server/ignitor/ignitor-cli"
import { resolve } from "@/utils/container/resolve"
import { command } from "@drizzle-team/brocli"
import { Prisma } from "@prisma/client"

export function seedEventsCommand() {
  return command({
    name: "seed_events",
    async handler() {
      const ignitor = new IgnitorCli()

      await ignitor.initialize()
      const { container, logger } = ignitor.ctx()

      const prisma = resolve(container, "prisma")

      const currentEventsCount = await prisma.event.count()

      if (currentEventsCount > 0) {
        logger.info("Exiting early, events have already been seeded.")

        await ignitor.shutdown()

        return
      }

      const sportsEvents: Prisma.EventCreateManyInput[] = [
        {
          eventName: "Soccer: Manchester United vs Liverpool FC",
          odds: new Prisma.Decimal(2.15),
        },
        {
          eventName: "Basketball: LA Lakers vs Golden State Warriors",
          odds: new Prisma.Decimal(1.85),
        },
        {
          eventName: "Tennis: Wimbledon Finals - Djokovic vs Alcaraz",
          odds: new Prisma.Decimal(1.95),
        },
        {
          eventName: "Formula 1: Monaco Grand Prix - Verstappen vs Hamilton",
          odds: new Prisma.Decimal(1.75),
        },
        {
          eventName: "Boxing: Heavyweight Championship - Fury vs Joshua",
          odds: new Prisma.Decimal(2.25),
        },
      ]

      const result = await prisma.event.createMany({
        data: sportsEvents,
      })

      logger.info(`Successfully seeded ${result.count} sports events.`)

      await ignitor.shutdown()
    },
  })
}
