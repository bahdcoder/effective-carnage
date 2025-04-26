import { AuthController } from "@/modules/api/auth/controllers/auth.controller.js"
import { UsersService } from "@/modules/api/auth/services/users.service.js"
import type { ModuleApplicationContext } from "@/modules/module.contract.js"
import { BaseModule } from "@/modules/shared/base.module.js"
import { resolve } from "@/utils/container/resolve.js"
import { asValue } from "awilix"
import { Router } from "express"

export class AuthModule extends BaseModule {
  async register(ctx: ModuleApplicationContext) {
    this.registerServices(ctx)

    const api = resolve(ctx.container, "router")

    const router = Router()

    this.registerControllerRoutes(ctx, router)

    api.use("/users", router)
  }

  protected registerControllerRoutes(
    ctx: ModuleApplicationContext,
    router: Router
  ) {
    const controller = new AuthController(ctx)

    router.get("/", controller.get)
    router.post("/", controller.store)
    // I know, i'm screaming too. But i'm exhausted and I just want to submit before the deadline.
    router.put("/", controller.update)
    router.delete("/", controller.destroy)
  }

  private registerServices(ctx: ModuleApplicationContext) {
    ctx.container.register({
      usersService: asValue(new UsersService(ctx)),
    })
  }
}
