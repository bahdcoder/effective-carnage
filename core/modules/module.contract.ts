import type { Express } from "express"
import { AwilixContainer } from "awilix"
import { Logger } from "pino"

export interface ModuleApplicationContext {
  app: Express
  logger: Logger
  container: AwilixContainer
}

/**
 * Module interface that all application modules must implement
 */
export interface ModuleContract {
  /**
   * Name of the module
   */
  name: string

  /**
   * Register the module with the application
   * @param app Express application instance
   */
  register(ctx: ModuleApplicationContext): Promise<void>

  shutdown(ctx: ModuleApplicationContext): Promise<void>
}
