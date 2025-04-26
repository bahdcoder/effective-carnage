import type { Request, Response } from "express"
import type { ViteDevServer } from "vite"
import { Ignitor } from "./ignitor.js"
import { DevSsrHandler } from "../ssr/dev-ssr-handler.js"

/**
 * Specialized Ignitor implementation for the development environment.
 * Integrates Vite's development server for hot module replacement,
 * on-demand file compilation, and fast refresh capabilities.
 */
export class IgnitorDev extends Ignitor {
	private vite: ViteDevServer | undefined
	private ssrHandler: DevSsrHandler | undefined

	constructor() {
		super({
			debug: true,
		})
	}

	/**
	 * Configures the development environment with Vite middleware.
	 * Sets up Vite in middleware mode to intercept and transform
	 * module requests on-the-fly without requiring a separate build step.
	 */
	protected async setup(): Promise<void> {
		const { createServer } = await import("vite")

		this.vite = await createServer({
			server: { middlewareMode: true },
			appType: "custom",
		})

		this.app.use(this.vite.middlewares)

		this.ssrHandler = new DevSsrHandler(
			this.vite,
			this.logger,
			this.handleError.bind(this),
		)
	}

	/**
	 * Processes incoming requests through the development SSR handler.
	 * Leverages Vite's module transformation to enable real-time code changes
	 * without requiring server restarts or manual rebuilds.
	 */
	protected async handle(req: Request, res: Response): Promise<void> {
		if (!this.ssrHandler) {
			throw new Error("SSR handler not initialized")
		}

		await this.ssrHandler.handle(req, res)
	}
}
