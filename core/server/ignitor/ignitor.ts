import { asValue, type AwilixContainer, createContainer } from "awilix"
import express, { type Express, type Request, type Response } from "express"
import type {
  ModuleApplicationContext,
  ModuleContract,
} from "@/modules/module.contract.js"
import { EnvModule } from "@/modules/env/env.module.js"
import { ConfigModule } from "@/modules/config/config.module.js"
import { RedisModule } from "@/modules/redis/redis.module.js"
import { HttpModule } from "@/modules/http/http.module.js"
import { PrismaModule } from "@/modules/prisma/prisma.module.js"
import { pino, type Logger } from "pino"
import { resolve } from "@/utils/container/resolve.js"
import { RouterModule } from "@/modules/api/router/router.module.js"
import { EventModule } from "@/modules/api/events/events.module.js"
import { AuthModule } from "@/modules/api/auth/auth.module.js"
import { ErrorsModule } from "@/modules/errors/errors.module.js"
import { BetModule } from "@/modules/api/bets/bets.module.js"

export interface IgnitorConfig {
  debug?: boolean
}

/**
 * Orchestrates the application bootstrap process with dependency injection.
 * Manages the lifecycle of all application modules in the correct order,
 * ensuring proper initialization and graceful shutdown of services.
 */
export abstract class Ignitor {
  protected app: Express
  protected logger: Logger
  protected container: AwilixContainer = createContainer({
    strict: true,
  })

  protected modules: ModuleContract[] = [
    new EnvModule(),
    new ConfigModule(),
    new RedisModule(),
    new PrismaModule(),
    new HttpModule(),
    new RouterModule(),
    new AuthModule(),
    new EventModule(),
    new BetModule(),
    new ErrorsModule(),
  ]

  constructor(config: IgnitorConfig) {
    this.app = express()

    this.logger = pino({
      level: config.debug ? "debug" : "info",
      transport: config.debug
        ? { target: "pino-pretty", options: { colorize: true } }
        : undefined,
    })

    this.container.register({
      logger: asValue(this.logger),
    })
  }

  /**
   * Initializes the application by setting up middleware and registering all modules.
   * Follows a specific order to ensure dependencies are available when needed.
   */
  public async initialize(): Promise<void> {
    await this.setup()

    for (const module of this.modules) {
      this.logger.info(`registering module: ${module.name}`)
      await module.register(this.ctx())
    }

    this.app.use("*all", this.handle.bind(this))
  }

  /**
   * Starts the HTTP server on the configured port and logs the access URL.
   */
  public start() {
    const env = resolve(this.container, "env")

    this.app.listen(env.PORT, () => {
      this.logger.info(`Server started at http://127.0.0.1:${env.PORT}`)
    })
  }

  protected abstract setup(): Promise<void>

  protected abstract handle(request: Request, response: Response): Promise<void>

  /**
   * Provides centralized error handling with environment-aware error details.
   * In development, includes stack traces; in production, hides implementation details.
   */
  protected handleError(error: Error, res: Response): void {
    this.logger.error(error)

    const config = resolve(this.container, "config")
    const errorResponse = {
      status: 500,
      message: "Internal Server Error",
      ...(config.isDev && error.stack ? { stack: error.stack } : {}),
    }

    res.status(500).json(errorResponse)
  }

  /**
   * Gracefully shuts down all modules in reverse initialization order.
   * Ensures resources like database connections are properly closed.
   */
  public shutdown = async () => {
    for (const module of this.modules) {
      this.logger.info(`shutting down module: ${module.name}`)

      await module.shutdown({
        app: this.app,
        logger: this.logger,
        container: this.container,
      })
    }
  }

  public ctx() {
    return {
      app: this.app,
      logger: this.logger,
      container: this.container,
    } satisfies ModuleApplicationContext
  }
}
