import fs from "node:fs/promises"
import type { Response } from "express"
import type {
	PipeableStream,
	RenderToPipeableStreamOptions,
} from "react-dom/server"
import type { ViteDevServer } from "vite"
import type { Logger } from "pino"
import { BaseSsrHandler } from "./base-ssr-handler.js"

/**
 * Handles server-side rendering in the development environment.
 * Leverages Vite's development server for on-the-fly module transformation,
 * hot module replacement, and improved debugging capabilities.
 */
export class DevSsrHandler extends BaseSsrHandler {
	private vite: ViteDevServer
	protected logger: Logger
	private errorHandler: (error: Error, res: Response) => void

	constructor(
		vite: ViteDevServer,
		logger: Logger,
		errorHandler: (error: Error, res: Response) => void,
	) {
		super()
		this.vite = vite
		this.logger = logger
		this.errorHandler = errorHandler
	}

	/**
	 * Loads and transforms the HTML template using Vite's transformIndexHtml.
	 * This enables development features like asset injection and environment
	 * variable replacement without requiring a rebuild.
	 */
	protected async loadTemplate(url: string): Promise<string> {
		const template = await fs.readFile("public/index.html", "utf-8")
		return (await this.vite.transformIndexHtml(url, template)) || template
	}

	/**
	 * Dynamically loads the server entry module using Vite's module loader.
	 * Enables instant updates to the SSR logic when code changes without
	 * requiring a server restart or manual rebuild.
	 */
	protected async loadRenderFunction(
		_url: string,
	): Promise<
		(url: string, options?: RenderToPipeableStreamOptions) => PipeableStream
	> {
		const module = await this.vite.ssrLoadModule("core/entry/server.tsx")

		if (!module || typeof module.render !== "function") {
			throw new Error("Failed to load render function from server module")
		}

		return module.render
	}

	/**
	 * Enhances error handling with Vite's stack trace fixing.
	 * Improves debugging by providing accurate source locations in error stacks
	 * despite the code transformation that happens during development.
	 */
	protected handleError(error: Error, response: Response): void {
		this.vite.ssrFixStacktrace(error)
		this.errorHandler(error, response)
	}
}
