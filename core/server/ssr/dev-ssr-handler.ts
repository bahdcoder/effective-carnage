import fs from "node:fs/promises";
import type { Response } from "express";
import type {
	PipeableStream,
	RenderToPipeableStreamOptions,
} from "react-dom/server";
import type { ViteDevServer } from "vite";
import type { Logger } from "pino";
import { BaseSsrHandler } from "./base-ssr-handler";

/**
 * Development SSR handler
 */
export class DevSsrHandler extends BaseSsrHandler {
	/**
	 * Vite dev server instance
	 */
	private vite: ViteDevServer;

	/**
	 * Logger instance
	 */
	protected logger: Logger;

	/**
	 * Error handler function
	 */
	private errorHandler: (error: Error, res: Response) => void;

	/**
	 * Create a new DevSsrHandler
	 */
	constructor(
		vite: ViteDevServer,
		logger: Logger,
		errorHandler: (error: Error, res: Response) => void,
	) {
		super();
		this.vite = vite;
		this.logger = logger;
		this.errorHandler = errorHandler;
	}

	/**
	 * Load the HTML template
	 */
	protected async loadTemplate(url: string): Promise<string> {
		const template = await fs.readFile("public/index.html", "utf-8");
		return (await this.vite.transformIndexHtml(url, template)) || template;
	}

	/**
	 * Load the render function
	 */
	protected async loadRenderFunction(
		_url: string,
	): Promise<
		(url: string, options?: RenderToPipeableStreamOptions) => PipeableStream
	> {
		const module = await this.vite.ssrLoadModule("core/entry/server.tsx");

		if (!module || typeof module.render !== "function") {
			throw new Error("Failed to load render function from server module");
		}

		return module.render;
	}

	/**
	 * Handle errors
	 */
	protected handleError(error: Error, response: Response): void {
		this.vite.ssrFixStacktrace(error);
		this.errorHandler(error, response);
	}
}
