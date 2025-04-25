import { Request, Response } from "express";
import type {
	PipeableStream,
	RenderToPipeableStreamOptions,
} from "react-dom/server";
import { Logger } from "pino";
import { renderReactStream } from "@/utils/ssr/render-stream";

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
	 * Handle the request
	 */
	public async handle(request: Request, response: Response): Promise<void> {
		try {
			const url = request.originalUrl;
			const template = await this.loadTemplate(url);
			const renderFn = await this.loadRenderFunction(url);

			await renderReactStream(renderFn, {
				url,
				template,
				response,
				logger: this.logger,
			});
		} catch (error: unknown) {
			this.handleError(
				error instanceof Error ? error : new Error(String(error)),
				response,
			);
		}
	}
}
