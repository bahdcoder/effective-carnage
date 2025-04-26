import request from "supertest"
import { IgnitorDev } from "@/server/ignitor/ignitor-dev"
import { afterAll, beforeAll, describe, expect, test } from "vitest"
import { resolve } from "@/utils/container/resolve"
import type { Event } from "@prisma/client"
import { PaginatedResponseData } from "@/modules/http/types/server-response.types"

describe("/api/v1/events", () => {
  const ignitor = new IgnitorDev()

  beforeAll(async () => ignitor.initialize())
  afterAll(async () => ignitor.shutdown())

  test("can fetch a paginated list of events", async () => {
    const response = await request(ignitor.ctx().app)
      .get("/api/v1/events")
      .expect(200)

    const { container } = ignitor.ctx()
    const prisma = resolve(container, "prisma")

    const totalEvents = await prisma.event.count()
    const events = await prisma.event.findMany()

    const data = response.body as PaginatedResponseData<Event>

    const eventIds = data.data.map((event) => event.id)

    expect(
      data.meta.count,
      "The total count in the paginated meta does not match the events from the database."
    ).toEqual(totalEvents)
    const allEventsPresentInResponse = events
      .map((event) => event.id)
      .every((event) => eventIds.includes(event))

    expect(
      allEventsPresentInResponse,
      "All the events from the database were not present in the response."
    ).toBe(true)
  })
})
