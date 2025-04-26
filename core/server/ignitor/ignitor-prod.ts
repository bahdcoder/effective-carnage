import type { Request, Response } from "express";
import { Ignitor } from "./ignitor";
import { ProdSsrHandler } from "../ssr/prod-ssr-handler";

/**
 * Production environment implementation of the Ignitor
 */
export class IgnitorProd extends Ignitor {
	private ssrHandler: ProdSsrHandler | undefined;

	constructor() {
		super({ debug: false });
	}

	/**
	 * Setup production environment
	 */
	protected async setup(): Promise<void> {
		// Initialize the SSR handler
		this.ssrHandler = new ProdSsrHandler(
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
