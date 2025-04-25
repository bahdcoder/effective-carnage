import { AuthController } from "@/modules/api/auth/controllers/auth.controller";
import { UsersService } from "@/modules/api/auth/services/users.service";
import { ModuleApplicationContext } from "@/modules/module.contract";
import { BaseModule } from "@/modules/shared/base.module";
import { resolve } from "@/utils/container/resolve";
import { asValue } from "awilix";
import { Router } from "express";

export class AuthModule extends BaseModule {
	async register(ctx: ModuleApplicationContext) {
		this.registerServices(ctx);

		const api = resolve(ctx.container, "router");

		const router = Router();

		this.registerControllerRoutes(ctx, router);

		api.use("/users", router);
	}

	protected registerControllerRoutes(
		ctx: ModuleApplicationContext,
		router: Router,
	) {
		const controller = new AuthController(ctx);

		router.post("/", controller.store);
	}

	private registerServices(ctx: ModuleApplicationContext) {
		ctx.container.register({
			eventsService: asValue(new UsersService(ctx)),
		});
	}
}
