import type { ModuleApplicationContext } from "@/modules/module.contract.js"
import { BaseModule } from "@/modules/shared/base.module.js"
import { resolve } from "@/utils/container/resolve.js"
import { PrismaClient } from "@prisma/client"
import { asValue } from "awilix"

/**
 * Manages database connectivity through Prisma ORM.
 * Provides a single shared database connection with automatic query logging
 * and connection pooling for optimal performance.
 */
export class PrismaModule extends BaseModule {
	name = "prisma"

	/**
	 * Initializes the Prisma client and establishes a database connection.
	 * Makes the client available to all other modules through dependency injection.
	 */
	async register({ container }: ModuleApplicationContext) {
		const prisma = new PrismaClient()

		await prisma.$connect()

		container.register({
			prisma: asValue(prisma),
		})
	}

	/**
	 * Safely disconnects from the database during application shutdown.
	 * Ensures all queries are completed and connections are properly closed.
	 */
	async shutdown({ container }: ModuleApplicationContext) {
		const prisma = resolve(container, "prisma")

		await prisma.$disconnect()
	}
}
