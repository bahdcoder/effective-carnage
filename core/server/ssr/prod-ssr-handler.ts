import fs from "node:fs/promises";
import { Response } from "express";
import type {
	PipeableStream,
	RenderToPipeableStreamOptions,
} from "react-dom/server";
import { Logger } from "pino";
import { BaseSsrHandler } from "./base-ssr-handler";

/**
 * Production SSR handler
 */
export class ProdSsrHandler extends BaseSsrHandler {
	/**
	 * Logger instance
	 */
	protected logger: Logger;

	/**
	 * Error handler function
	 */
	private errorHandler: (error: Error, res: Response) => void;

	/**
	 * Create a new ProdSsrHandler
	 */
	constructor(
		logger: Logger,
		errorHandler: (error: Error, res: Response) => void,
	) {
		super();
		this.logger = logger;
		this.errorHandler = errorHandler;
	}

	/**
	 * Get the path to a file in the build directory
	 */
	private getBuildPath(path: string): string {
		return `./build/${path}`;
	}

	/**
	 * Load the HTML template
	 */
	protected async loadTemplate(_url: string): Promise<string> {
		return await fs.readFile("./build/entry/client/index.html", "utf-8");
	}

	/**
	 * Load the render function
	 */
	protected async loadRenderFunction(
		_url: string,
	): Promise<
		(url: string, options?: RenderToPipeableStreamOptions) => PipeableStream
	> {
		const module = await import(this.getBuildPath("entry/server/server.js"));

		if (!module || typeof module.render !== "function") {
			throw new Error("Failed to load render function from server module");
		}

		return module.render;
	}

	/**
	 * Handle errors
	 */
	protected handleError(error: Error, res: Response): void {
		this.errorHandler(error, res);
	}
}
