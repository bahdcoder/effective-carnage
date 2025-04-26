import type { BetsService } from "@/modules/api/bets/services/bets.service"
import type { EventsService } from "@/modules/api/events/services/events.service"
import { NotFoundException } from "@/modules/errors/exceptions/not-found.exception"
import { HttpResponse } from "@/modules/http/helpers/response.helper"
import type { ModuleApplicationContext } from "@/modules/module.contract"
import { BaseController } from "@/modules/shared/controllers/base.controller"
import { resolve } from "@/utils/container/resolve"
import type { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"

export class BetsController extends BaseController {
  protected betsService: BetsService
  protected eventsService: EventsService

  constructor(protected ctx: ModuleApplicationContext) {
    super(ctx)

    this.betsService = resolve(ctx.container, "betsService")
    this.eventsService = resolve(ctx.container, "eventsService")
  }

  store = async (request: Request, response: Response) => {
    const eventId = request.params.eventId

    const event = await this.eventsService.findById(eventId)

    if (!event) {
      throw new NotFoundException(
        `We could not find an event with Id: ${eventId}`
      )
    }

    const bet = await this.betsService.create({
      event: { connect: { id: eventId } },
      user: { connect: { id: request.session?.user?.id as string } },
      amount: 0,
    })

    new HttpResponse(response).status(StatusCodes.CREATED).json({ data: bet })
  }
}
