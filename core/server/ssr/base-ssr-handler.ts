import { Request, Response } from "express"
import type {
  PipeableStream,
  RenderToPipeableStreamOptions,
} from "react-dom/server"
import { Logger } from "pino"
import { renderReactStream } from "@/utils/ssr/render-stream"
import type { SessionData } from "@/app/state/session-state"

/**
 * Base class for SSR handlers
 */
export abstract class BaseSsrHandler {
  /**
   * Logger instance
   */
  protected abstract logger: Logger

  /**
   * Load the HTML template
   */
  protected abstract loadTemplate(url: string): Promise<string>

  /**
   * Load the render function
   */
  protected abstract loadRenderFunction(
    url: string
  ): Promise<
    (url: string, options?: RenderToPipeableStreamOptions) => PipeableStream
  >

  /**
   * Handle errors
   */
  protected abstract handleError(error: Error, res: Response): void

  /**
   * Extract session data from the request
   */
  protected extractSessionData(request: Request): SessionData {
    // Access the session from the request
    // Express with cookie-session middleware adds session to the request object
    return request.session || {}
  }

  /**
   * Handle the request
   */
  public async handle(request: Request, response: Response): Promise<void> {
    try {
      const url = request.originalUrl
      const template = await this.loadTemplate(url)
      const renderFn = await this.loadRenderFunction(url)
      const sessionData = this.extractSessionData(request)

      await renderReactStream(renderFn, {
        url,
        template,
        response,
        logger: this.logger,
        // Pass session data to the render function
        sessionData,
      })
    } catch (error: unknown) {
      this.handleError(
        error instanceof Error ? error : new Error(String(error)),
        response
      )
    }
  }
}
