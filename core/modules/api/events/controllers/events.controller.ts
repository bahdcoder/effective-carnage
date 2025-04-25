import { eventsQueryParametersSchema } from "@/modules/api/events/dto/events.dto";
import { EventsService } from "@/modules/api/events/services/events.service";
import { ModuleApplicationContext } from "@/modules/module.contract";
import { BaseController } from "@/modules/shared/controllers/base.controller";
import { resolve } from "@/utils/container/resolve";
import { getPaginationQueryParameters } from "@/utils/http/get-pagination-query-parameters";
import { Request, Response } from "express";

export class EventsController extends BaseController {
	protected eventsService: EventsService;
	constructor(protected ctx: ModuleApplicationContext) {
		super(ctx);

		this.eventsService = resolve(ctx.container, "eventsService");
	}

	index = async (request: Request, response: Response) => {
		const data = await this.validate(
			getPaginationQueryParameters(request),
			eventsQueryParametersSchema(),
		);

		const events = await this.eventsService.events(data?.limit, data?.offset);

		response.json(events);
	};
}
