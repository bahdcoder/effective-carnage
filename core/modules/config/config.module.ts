import type { ModuleApplicationContext } from "@/modules/module.contract.js"
import { BaseModule } from "@/modules/shared/base.module.js"
import { resolve } from "@/utils/container/resolve.js"
import { asValue } from "awilix"

export interface ApplicationConfig {
	isDev: boolean
	isProd: boolean
	isTest: boolean
}

export class ConfigModule extends BaseModule {
	public name = "config"

	async register({ container }: ModuleApplicationContext) {
		const env = resolve(container, "env")

		container.register({
			config: asValue({
				isDev: env.NODE_ENV === "development",
				isProd: env.NODE_ENV === "production",
				isTest: env.NODE_ENV === "test",
			}),
		})
	}
}
