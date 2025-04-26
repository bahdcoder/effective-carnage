import { createClient } from "redis"
import type { ModuleApplicationContext } from "@/modules/module.contract.js"
import { resolve } from "@/utils/container/resolve.js"
import { asValue } from "awilix"
import { BaseModule } from "@/modules/shared/base.module.js"

/**
 * Provides Redis connection management for caching, session storage, and rate limiting.
 * Ensures a single shared connection is available throughout the application lifecycle.
 */
export class RedisModule extends BaseModule {
	name = "redis"

	/**
	 * Establishes a Redis connection using environment configuration
	 * and registers the client in the dependency container.
	 */
	async register({ container }: ModuleApplicationContext) {
		const env = resolve(container, "env")

		const client = createClient({
			url: env.REDIS_URL,
		})

		await client.connect()

		container.register({
			redis: asValue(client),
		})
	}

	/**
	 * Gracefully closes the Redis connection during application shutdown
	 * to prevent connection leaks and ensure data integrity.
	 */
	async shutdown({ container }: ModuleApplicationContext) {
		const client = resolve(container, "redis")

		await client.quit()
	}
}
