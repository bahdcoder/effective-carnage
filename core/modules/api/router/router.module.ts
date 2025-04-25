import { AuthMiddleware } from "@/modules/api/router/middleware/auth.middleware";
import { ModuleApplicationContext } from "@/modules/module.contract";
import { BaseModule } from "@/modules/shared/base.module";
import { asValue } from "awilix";
import { Router } from "express";

export class RouterModule extends BaseModule {
	name = "api-router";

	async register(ctx: ModuleApplicationContext) {
		const router = Router();

		this.registerGlobalMiddleware(ctx);
		this.registerApiOnlyMiddleware(ctx, router);

		ctx.app.use("/api/v1", router);

		ctx.container.register({
			router: asValue(router),
		});
	}

	protected registerGlobalMiddleware(ctx: ModuleApplicationContext) {
		ctx.app.use(new AuthMiddleware(ctx).handle);
	}

	protected registerApiOnlyMiddleware(
		_ctx: ModuleApplicationContext,
		_router: Router,
	) {}
}
