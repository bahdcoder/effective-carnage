import type { ModuleApplicationContext } from "@/modules/module.contract.js"
import { BaseModule } from "@/modules/shared/base.module.js"
import { asValue } from "awilix"
import { Router } from "express"

export class RouterModule extends BaseModule {
	name = "api-router"

	async register(ctx: ModuleApplicationContext) {
		const router = Router()

		ctx.app.use("/api/v1", router)

		ctx.container.register({
			router: asValue(router),
		})
	}
}
