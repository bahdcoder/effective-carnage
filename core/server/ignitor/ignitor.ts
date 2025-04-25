import { Transform } from "node:stream"
import { asValue, AwilixContainer, createContainer } from "awilix"
import express, { type Express, type Request, type Response } from "express"
import type { ModuleContract } from "@/modules/module.contract"
import { EnvModule } from "@/modules/env/env.module"
import { ConfigModule } from "@/modules/config/config.module"
import { RedisModule } from "@/modules/redis/redis.module"
import { HttpModule } from "@/modules/http/http.module"
import { PrismaModule } from "@/modules/prisma/prisma.module"
import { pino, type Logger } from "pino"
import { resolve } from "@/utils/container/resolve"
/**
 * Configuration options for the Ignitor
 */
export interface IgnitorConfig {
  debug?: boolean
}

/**
 * Base Ignitor class that provides common functionality for server initialization
 */
export abstract class Ignitor {
  protected app: Express
  protected logger: Logger
  protected container: AwilixContainer = createContainer({
    strict: true,
  })

  protected modules: ModuleContract[] = [
    /** Register env and config. Must be the most early registered modules as they load environment information */
    new EnvModule(),
    new ConfigModule(),

    /* Setup databases immediately after env and config, as most modules rely on them */
    new RedisModule(),
    new PrismaModule(),

    new HttpModule(),
  ]

  /**
   * Creates a new Ignitor instance
   * @param config Server configuration options
   */
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

  public async initialize(): Promise<void> {
    await this.setup()

    for (const module of this.modules) {
      this.logger.info(`registering module: ${module.name}`)

      await module.register({
        app: this.app,
        logger: this.logger,
        container: this.container,
      })
    }

    this.app.use("*all", this.handleRequest.bind(this))
  }

  /**
   * Start the HTTP server
   */
  public start() {
    const env = resolve(this.container, "env")

    this.app.listen(env.PORT, () => {
      this.logger.info(`Server started at http://127.0.0.1:${env.PORT}`)
    })
  }

  /**
   * Setup middleware based on the environment
   * This is implemented by the derived classes
   */
  protected abstract setup(): Promise<void>

  /**
   * Handle incoming requests
   * @param req Express request object
   * @param res Express response object
   */
  protected abstract handleRequest(req: Request, res: Response): Promise<void>

  /**
   * Create a transform stream for piping React SSR output to the response
   * @param res Express response object
   * @returns Transform stream
   */
  protected createTransformStream(res: Response): Transform {
    return new Transform({
      transform(chunk, encoding, callback) {
        res.write(chunk, encoding)
        callback()
      },
    })
  }

  /**
   * Handle errors in the request pipeline
   * @param error Error object
   * @param res Express response object
   */
  protected handleError(error: Error, res: Response): void {
    console.error(error)
    res.status(500).end(error.stack)
  }
}
