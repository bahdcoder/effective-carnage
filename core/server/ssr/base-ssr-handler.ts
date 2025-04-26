import type { Request, Response } from "express"
import type {
  PipeableStream,
  RenderToPipeableStreamOptions,
} from "react-dom/server"
import type { Logger } from "pino"
import { renderReactStream } from "@/utils/ssr/render-stream.js"
import type { SessionState } from "@/app/state/session-state.js"
import { HttpResponse } from "@/modules/http/helpers/response.helper.js"
import { StatusCodes } from "http-status-codes"

/**
 * Provides a template method pattern for server-side rendering implementations.
 * Defines the core SSR workflow while allowing environment-specific implementations
 * to customize template loading, render function acquisition, and error handling.
 */
export abstract class BaseSsrHandler {
  protected abstract logger: Logger

  protected abstract loadTemplate(url: string): Promise<string>

  protected abstract loadRenderFunction(
    url: string
  ): Promise<
    (url: string, options?: RenderToPipeableStreamOptions) => PipeableStream
  >

  protected abstract handleError(error: Error, res: Response): void

  /**
   * Extracts session data from the request for hydration into the client.
   * Ensures consistent state between server and client rendering.
   */
  protected extractsessionState(request: Request): SessionState {
    return request.session || {}
  }

  /**
   * Prevents API routes from being handled by the SSR pipeline.
   * Returns a 404 response for API paths that don't match any defined routes.
   *
   * if this method is executed, it means no api routes matched down the entire routes
   * pipeline, so we have to return a 404.
   *
   * We can do same for assets like css and fonts, because reaching here means
   * none of them were matched by express.static.
   */
  protected invalidApiResource(request: Request, response: Response) {
    if (request.originalUrl.includes("api")) {
      new HttpResponse(response)
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "No resource is available at this url." })

      return true
    }

    return false
  }

  /**
   * Orchestrates the complete SSR process from request to response.
   * Loads templates, initializes rendering, and handles errors while
   * ensuring session state is properly passed to the client.
   */
  public async handle(request: Request, response: Response): Promise<void> {
    if (this.invalidApiResource(request, response)) {
      return
    }

    try {
      const url = request.originalUrl
      const template = await this.loadTemplate(url)
      const renderFn = await this.loadRenderFunction(url)
      const sessionState = this.extractsessionState(request)

      await renderReactStream(renderFn, {
        url,
        template,
        response,
        logger: this.logger,
        sessionState: {
          ...sessionState,
          isProd: request.app.locals.env.NODE_ENV === "production",
          isDev: request.app.locals.env.NODE_ENV === "development",
        },
      })
    } catch (error: unknown) {
      this.handleError(
        error instanceof Error ? error : new Error(String(error)),
        response
      )
    }
  }
}
