import fs from "node:fs/promises"
import type { Response } from "express"
import type {
	PipeableStream,
	RenderToPipeableStreamOptions,
} from "react-dom/server"
import type { Logger } from "pino"
import { BaseSsrHandler } from "./base-ssr-handler.js"
import { resolve } from "node:path"

/**
 * Handles server-side rendering in the production environment.
 * Optimized for performance with pre-built assets and minimal
 * runtime overhead for handling high-traffic production loads.
 */
export class ProdSsrHandler extends BaseSsrHandler {
	protected logger: Logger
	private errorHandler: (error: Error, res: Response) => void

	constructor(
		logger: Logger,
		errorHandler: (error: Error, res: Response) => void,
	) {
		super()
		this.logger = logger
		this.errorHandler = errorHandler
	}

	/**
	 * Resolves absolute paths to build artifacts.
	 * Ensures consistent file access regardless of the current working directory,
	 * preventing path resolution issues in different deployment environments.
	 */
	private getBuildPath(path: string): string {
		return resolve(process.cwd(), `./build/${path}`)
	}

	/**
	 * Loads the pre-built HTML template from the build directory.
	 * Uses the static template that includes all necessary asset references
	 * and metadata for production rendering.
	 */
	protected async loadTemplate(_url: string): Promise<string> {
		return await fs.readFile("./build/entry/client/public/index.html", "utf-8")
	}

	/**
	 * Loads the pre-compiled server render function from the build output.
	 * Uses dynamic imports to load the optimized production bundle
	 * with all dependencies already resolved and code optimized.
	 */
	protected async loadRenderFunction(
		_url: string,
	): Promise<
		(url: string, options?: RenderToPipeableStreamOptions) => PipeableStream
	> {
		const module = await import(this.getBuildPath("entry/server/server.js"))

		if (!module || typeof module.render !== "function") {
			throw new Error("Failed to load render function from server module")
		}

		return module.render
	}

	/**
	 * Provides streamlined error handling for production.
	 * Delegates to the global error handler without additional processing
	 * to minimize overhead in error scenarios.
	 */
	protected handleError(error: Error, res: Response): void {
		this.errorHandler(error, res)
	}
}
