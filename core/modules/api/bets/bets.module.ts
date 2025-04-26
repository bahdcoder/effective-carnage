import { BetsController } from "@/modules/api/bets/controllers/bets.controller";
import { BetsService } from "@/modules/api/bets/services/bets.service";
import { AuthMiddleware } from "@/modules/api/router/middleware/auth.middleware";
import type { ModuleApplicationContext } from "@/modules/module.contract";
import { BaseModule } from "@/modules/shared/base.module";
import { resolve } from "@/utils/container/resolve";
import { asValue } from "awilix";
import { Router } from "express";

export class BetModule extends BaseModule {
	async register(ctx: ModuleApplicationContext) {
		const api = resolve(ctx.container, "router");

		this.registerServices(ctx);

		const router = Router({ mergeParams: true });

		this.registerControllerRoutes(ctx, router);

		api.use("/events/:eventId/bets", router);
	}

	protected registerControllerRoutes(
		ctx: ModuleApplicationContext,
		router: Router,
	) {
		const controller = new BetsController(ctx);

		router.post("/", new AuthMiddleware(ctx).handle, controller.store);
	}

	private registerServices(ctx: ModuleApplicationContext) {
		ctx.container.register({
			betsService: asValue(new BetsService(ctx)),
		});
	}
}
