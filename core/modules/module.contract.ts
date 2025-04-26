import type { Express } from "express"
import type { AwilixContainer } from "awilix"
import type { Logger } from "pino"

/**
 * Provides essential application components to modules during initialization.
 * Contains the Express app instance, dependency container, and logger.
 */
export interface ModuleApplicationContext {
	app: Express
	logger: Logger
	container: AwilixContainer
}

/**
 * Defines the contract that all application modules must implement.
 * Ensures consistent lifecycle management across different modules.
 */
export interface ModuleContract {
	name: string

	/**
	 * Initializes the module during application startup.
	 * Registers services, middleware, and performs any necessary setup.
	 */
	register(ctx: ModuleApplicationContext): Promise<void>

	/**
	 * Performs cleanup during application shutdown.
	 * Closes connections, releases resources, and ensures graceful termination.
	 */
	shutdown(ctx: ModuleApplicationContext): Promise<void>
}
