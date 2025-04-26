import { Ignitor } from "@/server/ignitor/ignitor.js"

/**
 * Specialized Ignitor implementation for CLI operations.
 * Provides access to the application's dependency container and services
 * without starting an HTTP server, enabling command-line utilities
 * to leverage the same infrastructure as the web application.
 */
export class IgnitorCli extends Ignitor {
	constructor() {
		super({
			debug: true,
		})
	}

	/**
	 * Minimal setup for CLI operations.
	 * No HTTP-specific middleware or handlers are needed.
	 */
	async setup() {}

	/**
	 * No-op request handler since CLI operations don't process HTTP requests.
	 * Required to satisfy the abstract base class contract.
	 */
	async handle() {}
}
