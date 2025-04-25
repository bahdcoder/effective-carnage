import { cleanEnv, num, port, str } from "envalid"
import type { ModuleApplicationContext } from "@/modules/module.contract"
import { asValue } from "awilix"
import { BaseModule } from "@/modules/shared/base.module"

export interface ApplicationEnv {
  NODE_ENV: "development" | "test" | "production"
  PORT: number
  BASE: string
  ABORT_DELAY: number
  DATABASE_URL: string
  REDIS_URL: string
}

/**
 * Environment module that validates and provides access to environment variables
 */
export class EnvModule extends BaseModule {
  public name = "env"
  private env: Readonly<ApplicationEnv> | undefined

  /**
   * Register the module with the application
   * Validates environment variables and makes them available to the application
   * @param app Express application instance
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
   * Validate environment variables using envalid
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
    })
  }
}
