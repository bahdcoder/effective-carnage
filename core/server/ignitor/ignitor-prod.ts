import type { Request, Response } from "express"
import { Ignitor } from "./ignitor.js"
import { ProdSsrHandler } from "../ssr/prod-ssr-handler.js"

/**
 * Specialized Ignitor implementation for the production environment.
 * Optimized for performance and reliability with pre-built assets
 * and minimal runtime overhead.
 */
export class IgnitorProd extends Ignitor {
  private ssrHandler: ProdSsrHandler | undefined

  constructor() {
    super({ debug: false })
  }

  /**
   * Sets up the production environment with minimal middleware.
   * Initializes the production SSR handler which uses pre-compiled
   * assets for optimal performance.
   */
  protected async setup(): Promise<void> {
    this.ssrHandler = new ProdSsrHandler(
      this.logger,
      this.handleError.bind(this)
    )
  }

  /**
   * Processes incoming requests through the production SSR handler.
   * Serves pre-built assets and performs server-side rendering
   * with optimized performance for production traffic.
   */
  protected async handle(req: Request, res: Response): Promise<void> {
    if (!this.ssrHandler) {
      throw new Error("SSR handler not initialized")
    }

    await this.ssrHandler.handle(req, res)
  }
}
