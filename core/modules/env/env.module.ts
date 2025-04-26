import { cleanEnv, num, port, str } from "envalid"
import type { ModuleApplicationContext } from "@/modules/module.contract.js"
import { asValue } from "awilix"
import { BaseModule } from "@/modules/shared/base.module.js"

export interface ApplicationEnv {
	NODE_ENV: "development" | "test" | "production"
	PORT: number
	BASE: string
	ABORT_DELAY: number
	DATABASE_URL: string
	REDIS_URL: string
	APP_KEY: string
}

/**
 * Validates and provides type-safe access to environment variables.
 * Must be one of the first modules loaded as other modules depend on
 * environment configuration to initialize properly.
 */
export class EnvModule extends BaseModule {
	public name = "env"
	private env: Readonly<ApplicationEnv> | undefined

	/**
	 * Validates environment variables and registers them in the DI container.
	 * Also makes environment available to Express via app.locals for template rendering.
	 */
	public async register({
		app,
		container,
	}: ModuleApplicationContext): Promise<void> {
		this.env = this.validateEnv()

		app.locals.env = this.env

		container.register({
			env: asValue(this.env),
		})
	}

	/**
	 * Validates environment variables with sensible defaults where appropriate.
	 * Throws errors for required variables that are missing or invalid.
	 */
	private validateEnv() {
		return cleanEnv(process.env, {
			NODE_ENV: str({
				choices: ["development", "test", "production"],
				default: "development",
			}),
			PORT: port({ default: 5173 }),
			BASE: str({ default: "/" }),
			ABORT_DELAY: num({ default: 10000 }),
			DATABASE_URL: str({
				desc: "PostgreSQL connection string",
				example: "postgresql://user:password@localhost:5433/database",
			}),
			REDIS_URL: str({
				desc: "Redis connection string",
				example: "redis://:password@localhost:6380",
			}),
			APP_KEY: str({
				desc: "Application key used for encrypting and descrypting sensitive information",
			}),
		})
	}
}
