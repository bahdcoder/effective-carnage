import { EventsController } from "@/modules/api/events/controllers/events.controller.js"
import { EventsService } from "@/modules/api/events/services/events.service.js"
import type { ModuleApplicationContext } from "@/modules/module.contract.js"
import { BaseModule } from "@/modules/shared/base.module.js"
import { resolve } from "@/utils/container/resolve.js"
import { asValue } from "awilix"
import { Router } from "express"

export class EventModule extends BaseModule {
	async register(ctx: ModuleApplicationContext) {
		const api = resolve(ctx.container, "router")

		this.registerServices(ctx)

		const router = Router({ mergeParams: true })

		this.registerControllerRoutes(ctx, router)

		api.use("/events", router)
	}

	protected registerControllerRoutes(
		ctx: ModuleApplicationContext,
		router: Router,
	) {
		const controller = new EventsController(ctx)

		router.get("/", controller.index)
	}

	private registerServices(ctx: ModuleApplicationContext) {
		ctx.container.register({
			eventsService: asValue(new EventsService(ctx)),
		})
	}
}
