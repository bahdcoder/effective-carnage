import compression from "compression"
import sirv from "sirv"
import helmet from "helmet"
import cors from "cors"
import express from "express"
import cookieSession from "cookie-session"
import { type RedisReply, RedisStore } from "rate-limit-redis"
import { rateLimit } from "express-rate-limit"
import { scopePerRequest } from "awilix-express"
import type { ModuleApplicationContext } from "@/modules/module.contract.js"
import { resolve } from "@/utils/container/resolve.js"
import { BaseModule } from "@/modules/shared/base.module.js"

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
      this.registerSecurityHeadersMiddleware(ctx)
    }
  }

  private registerCompressionMiddleware({ app }: ModuleApplicationContext) {
    app.use(compression())
  }

  private registerStaticFilesMiddleware({
    app,
    container,
  }: ModuleApplicationContext) {
    const { BASE } = resolve(container, "env")

    app.use(BASE, sirv("./build/entry/client", { extensions: [] }))
  }

  private registerSecurityHeadersMiddleware({ app }: ModuleApplicationContext) {
    app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            "script-src": ["'self'"],
          },
        },
      })
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

  private registerRateLimitMiddleware(ctx: ModuleApplicationContext) {
    const redis = resolve(ctx.container, "redis")
    const config = resolve(ctx.container, "config")

    const limiter = rateLimit({
      max: 60, // 60 seconds
      windowMs: 60 * 1000, // 1 minute
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

  private registerCookiesSessionMiddleware({
    app,
    container,
  }: ModuleApplicationContext) {
    const env = resolve(container, "env")

    app.use(
      cookieSession({
        name: "___session",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        keys: [env.APP_KEY],
      })
    )
  }
}
