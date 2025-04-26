import type { ModuleApplicationContext } from "@/modules/module.contract.js"
import { resolve } from "@/utils/container/resolve.js"

/**
 * Provides a foundation for all service classes with access to shared resources.
 * Centralizes access to the database and other dependencies through the DI container.
 */
export class BaseService {
  constructor(protected ctx: ModuleApplicationContext) {}

  /**
   * Provides type-safe access to the Prisma client for database operations.
   * Uses the dependency container to ensure a single shared database connection.
   */
  protected prisma() {
    return resolve(this.ctx.container, "prisma")
  }
}
