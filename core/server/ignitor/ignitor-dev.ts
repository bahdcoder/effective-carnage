import type { Request, Response } from "express";
import type { ViteDevServer } from "vite";
import { Ignitor } from "./ignitor";
import { DevSsrHandler } from "../ssr/dev-ssr-handler";

/**
 * Development environment implementation of the Ignitor
 */
export class IgnitorDev extends Ignitor {
	private vite: ViteDevServer | undefined;
	private ssrHandler: DevSsrHandler | undefined;

	constructor() {
		super({
			debug: true,
		});
	}

	/**
	 * Setup development middleware including Vite
	 */
	protected async setup(): Promise<void> {
		const { createServer } = await import("vite");

		this.vite = await createServer({
			server: { middlewareMode: true },
			appType: "custom",
		});

		this.app.use(this.vite.middlewares);

		// Initialize the SSR handler
		this.ssrHandler = new DevSsrHandler(
			this.vite,
			this.logger,
			this.handleError.bind(this),
		);
	}

	/**
	 * Handle requests in development mode
	 * Uses Vite's HMR and module transformation capabilities
	 */
	protected async handle(req: Request, res: Response): Promise<void> {
		if (!this.ssrHandler) {
			throw new Error("SSR handler not initialized");
		}

		await this.ssrHandler.handle(req, res);
	}
}
