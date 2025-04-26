import { createClient } from "redis"
import type { ModuleApplicationContext } from "@/modules/module.contract.js"
import { resolve } from "@/utils/container/resolve.js"
import { asValue } from "awilix"
import { BaseModule } from "@/modules/shared/base.module.js"

export class RedisModule extends BaseModule {
	name = "redis"

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

	async shutdown({ container }: ModuleApplicationContext) {
		const client = resolve(container, "redis")

		await client.quit()
	}
}
