import compression from "compression"
import sirv from "sirv"
import helmet from "helmet"
import cors from "cors"
import { ModuleApplicationContext } from "@/modules/module.contract"
import { resolve } from "@/utils/container/resolve"
import { BaseModule } from "@/modules/shared/base.module"

export class HttpModule extends BaseModule {
  name = "http"

  async register(ctx: ModuleApplicationContext) {
    const config = resolve(ctx.container, "config")

    this.registerCorsMiddleware(ctx)
    this.registerSecurityHeadersMiddleware(ctx)

    if (config.isProd) {
      this.registerCompressionMiddleware(ctx)
      this.registerStaticFilesMiddleware(ctx)
    }
  }

  private registerCompressionMiddleware({ app }: ModuleApplicationContext) {
    app.use(compression())
  }

  private registerStaticFilesMiddleware({
    app,
    container,
  }: ModuleApplicationContext) {
    const { BASE } = resolve(container, "env")

    app.use(BASE, sirv("./build/entry/client", { extensions: [] }))
  }

  private registerSecurityHeadersMiddleware({ app }: ModuleApplicationContext) {
    app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            "script-src": ["'self'"],
          },
        },
      })
    )
  }

  private registerCorsMiddleware({ app }: ModuleApplicationContext) {
    app.use(cors())
  }
}
