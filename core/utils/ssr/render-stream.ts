import type { Response } from "express";
import type {
	PipeableStream,
	RenderToPipeableStreamOptions,
} from "react-dom/server";
import type { Transform } from "node:stream";
import type { Logger } from "pino";
import { createTransformStream } from "@/utils/http/create-stream";
import { StatusCodes } from "http-status-codes";
import type { SessionState } from "@/app/state/session-state";

/**
 * Reference to track error state
 */
export interface ErrorRef {
	current: boolean;
}

/**
 * Options for creating a React render stream
 */
export interface RenderStreamOptions {
	/**
	 * URL to render
	 */
	url: string;

	/**
	 * HTML template
	 */
	template: string;

	/**
	 * Expresponses response object
	 */
	response: Response;

	/**
	 * Logger instance
	 */
	logger: Logger;

	/**
	 * Timeout in milliseconds
	 */
	timeoutMs?: number;

	/**
	 * Session data to pass to the client
	 */
	sessionState?: SessionState;
}

/**
 * Custom render options with transform stream
 */
export interface CustomRenderOptions extends RenderToPipeableStreamOptions {
	onShellReady: () => Transform;
}

/**
 * Create render stream options with error handling
 */
export function createRenderStreamOptions(
	options: RenderStreamOptions,
	didErrorRef: ErrorRef,
): CustomRenderOptions {
	const { response, logger, template } = options;

	return {
		onShellError: (error: unknown): void => {
			logger.error(
				"Shell error:",
				error instanceof Error ? error : String(error),
			);
			response.status(500);
			response.set({ "Content-Type": "text/html" });
			response.send("<h1>Something went wrong</h1>");
		},
		onShellReady: (): Transform => {
			response.status(
				didErrorRef.current
					? StatusCodes.INTERNAL_SERVER_ERROR
					: StatusCodes.OK,
			);
			response.set({ "Content-Type": "text/html" });

			const transformStream = createTransformStream(response);
			const [htmlStart, htmlEnd] = template.split("<!--app-html-->");

			// Inject session data into the HTML template
			// This will be available to the client-side code via window.__SESSION_DATA__
			const sessionScript = options.sessionState
				? `<script>window.__SESSION_DATA__ = ${JSON.stringify(
						options.sessionState,
					)};</script>`
				: "";

			// Write the HTML start and session data script
			response.write(htmlStart + sessionScript);

			transformStream.on("finish", () => {
				response.end(htmlEnd);
			});

			return transformStream;
		},
		onError: (error: unknown): void => {
			didErrorRef.current = true;
			logger.error(error instanceof Error ? error : String(error));
		},
	};
}

/**
 * Render a React stream with the given options
 */
export async function renderReactStream(
	renderFn: (
		url: string,
		options: RenderToPipeableStreamOptions & { sessionState?: SessionState },
	) => PipeableStream,
	options: RenderStreamOptions,
): Promise<void> {
	const { url, timeoutMs = 25000, sessionState } = options;
	const didErrorRef: ErrorRef = { current: false };

	const renderOptions = createRenderStreamOptions(options, didErrorRef);
	const { pipe, abort } = renderFn(url, {
		...renderOptions,
		// Pass session data to the render function
		sessionState,
		onShellReady: (): void => {
			const transformStream = renderOptions.onShellReady();
			pipe(transformStream);
		},
	});

	// Set timeout to abort rendering if it takes too long
	setTimeout(() => {
		abort();
	}, timeoutMs);
}
