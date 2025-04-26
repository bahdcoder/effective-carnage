import compression from "compression"
import cors from "cors"
import express from "express"
import cookieSession from "cookie-session"
import { type RedisReply, RedisStore } from "rate-limit-redis"
import { rateLimit } from "express-rate-limit"
import { scopePerRequest } from "awilix-express"
import type { ModuleApplicationContext } from "@/modules/module.contract.js"
import { resolve } from "@/utils/container/resolve.js"
import { BaseModule } from "@/modules/shared/base.module.js"
import path from "node:path"

/**
 * Configures all HTTP-related middleware and services for the application.
 * Handles cross-cutting concerns like CORS, compression, rate limiting,
 * session management, and static file serving.
 */
export class HttpModule extends BaseModule {
  name = "http"

  async register(ctx: ModuleApplicationContext) {
    const config = resolve(ctx.container, "config")

    this.registerCorsMiddleware(ctx)
    this.registerBodyParserMiddleware(ctx)
    this.registerRateLimitMiddleware(ctx)
    this.registerContainerScopeMiddleware(ctx)
    this.registerCookiesSessionMiddleware(ctx)

    if (config.isProd) {
      this.registerCompressionMiddleware(ctx)
      this.registerStaticFilesMiddleware(ctx)
    }
  }

  private registerCompressionMiddleware({ app }: ModuleApplicationContext) {
    app.use(compression())
  }

  private registerStaticFilesMiddleware({ app }: ModuleApplicationContext) {
    app.use(
      "/assets",
      express.static(path.resolve(process.cwd(), "./build/entry/client/assets"))
    )
    app.use(
      "/assets",
      express.static(path.resolve(process.cwd(), "./build/entry/client"))
    )

    app.use(
      "/fonts",
      express.static(path.resolve(process.cwd(), "./build/entry/client/fonts"))
    )
  }

  private registerBodyParserMiddleware({ app }: ModuleApplicationContext) {
    app.use(express.json())
  }

  private registerCorsMiddleware({ app }: ModuleApplicationContext) {
    app.use(cors())
  }

  private registerContainerScopeMiddleware({
    app,
    container,
  }: ModuleApplicationContext) {
    app.use(scopePerRequest(container))
  }

  /**
   * Sets up Redis-backed rate limiting to protect against abuse.
   * Only applied in production to avoid hindering development and testing.
   */
  private registerRateLimitMiddleware(ctx: ModuleApplicationContext) {
    const redis = resolve(ctx.container, "redis")
    const config = resolve(ctx.container, "config")

    const limiter = rateLimit({
      max: 60,
      windowMs: 60 * 1000,
      standardHeaders: true,
      legacyHeaders: false,
      store: new RedisStore({
        sendCommand: (...args: string[]) =>
          redis.sendCommand(args) as Promise<RedisReply>,
      }),
    })

    if (config.isProd) {
      ctx.app.use(limiter)
    }
  }

  /**
   * Configures secure cookie-based sessions with a 30-day expiration.
   * Uses the application key for signing to prevent tampering.
   */
  private registerCookiesSessionMiddleware({
    app,
    container,
  }: ModuleApplicationContext) {
    const env = resolve(container, "env")

    app.use(
      cookieSession({
        name: "___session",
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [env.APP_KEY],
      })
    )
  }
}
