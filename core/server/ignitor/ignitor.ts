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
		new RouterModule(),

		// api
		new AuthModule(),
		new EventModule(),
		new BetModule(),

		// error handling
		new ErrorsModule(),
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

			await module.register(this.ctx())
		}

		this.app.use("*all", this.handle.bind(this))
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
	protected abstract handle(request: Request, response: Response): Promise<void>

	/**
	 * Handle errors in the request pipeline
	 * @param error Error object
	 * @param res Express response object
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
