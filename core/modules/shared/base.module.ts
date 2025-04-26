import type {
  ModuleApplicationContext,
  ModuleContract,
} from "@/modules/module.contract.js"

/**
 * Provides a foundation for all application modules with lifecycle hooks.
 * Implements the ModuleContract interface with no-op default implementations
 * to simplify creation of new modules that may not need shutdown logic.
 */
export class BaseModule implements ModuleContract {
  name = "base"

  /**
   * Called during application startup to initialize the module.
   * Override this method to register services, middleware, or perform setup.
   */
  async register(_ctx: ModuleApplicationContext) {}

  /**
   * Called during application shutdown to clean up resources.
   * Override this method to close connections or perform cleanup tasks.
   */
  async shutdown(_ctx: ModuleApplicationContext) {}
}
