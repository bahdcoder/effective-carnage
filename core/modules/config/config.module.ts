import type { ModuleApplicationContext } from "@/modules/module.contract.js"
import { BaseModule } from "@/modules/shared/base.module.js"
import { resolve } from "@/utils/container/resolve.js"
import { asValue } from "awilix"

export interface ApplicationConfig {
  isDev: boolean
  isProd: boolean
  isTest: boolean
}

/**
 * Provides environment-aware configuration derived from environment variables.
 * Creates a simplified interface for checking the current environment without
 * direct string comparisons throughout the codebase.
 */
export class ConfigModule extends BaseModule {
  public name = "config"

  /**
   * Transforms raw environment variables into a structured configuration object.
   * Registers boolean flags for environment checks to simplify conditional logic.
   */
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
