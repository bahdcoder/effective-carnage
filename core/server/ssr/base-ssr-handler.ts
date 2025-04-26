import type { Request, Response } from "express";
import type {
	PipeableStream,
	RenderToPipeableStreamOptions,
} from "react-dom/server";
import type { Logger } from "pino";
import { renderReactStream } from "@/utils/ssr/render-stream";
import type { SessionState } from "@/app/state/session-state";
import { HttpResponse } from "@/modules/http/helpers/response.helper";
import { StatusCodes } from "http-status-codes";

/**
 * Base class for SSR handlers
 */
export abstract class BaseSsrHandler {
	/**
	 * Logger instance
	 */
	protected abstract logger: Logger;

	/**
	 * Load the HTML template
	 */
	protected abstract loadTemplate(url: string): Promise<string>;

	/**
	 * Load the render function
	 */
	protected abstract loadRenderFunction(
		url: string,
	): Promise<
		(url: string, options?: RenderToPipeableStreamOptions) => PipeableStream
	>;

	/**
	 * Handle errors
	 */
	protected abstract handleError(error: Error, res: Response): void;

	/**
	 * Extract session data from the request
	 */
	protected extractsessionState(request: Request): SessionState {
		// Access the session from the request
		// Express with cookie-session middleware adds session to the request object
		return request.session || {};
	}

	protected invalidApiResource(request: Request, response: Response) {
		if (request.originalUrl.includes("api")) {
			new HttpResponse(response)
				.status(StatusCodes.NOT_FOUND)
				.json({ message: "No resource is available at this url." });

			return true;
		}

		return false;
	}

	/**
	 * Handle the request
	 */
	public async handle(request: Request, response: Response): Promise<void> {
		if (this.invalidApiResource(request, response)) {
			return;
		}

		try {
			const url = request.originalUrl;
			const template = await this.loadTemplate(url);
			const renderFn = await this.loadRenderFunction(url);
			const sessionState = this.extractsessionState(request);

			await renderReactStream(renderFn, {
				url,
				template,
				response,
				logger: this.logger,
				// Pass session data to the render function
				sessionState,
			});
		} catch (error: unknown) {
			this.handleError(
				error instanceof Error ? error : new Error(String(error)),
				response,
			);
		}
	}
}
