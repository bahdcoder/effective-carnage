import { Response } from "express";
import type {
	PipeableStream,
	RenderToPipeableStreamOptions,
} from "react-dom/server";
import { Transform } from "node:stream";
import { Logger } from "pino";
import { createTransformStream } from "@/utils/http/create-stream";
import { StatusCodes } from "http-status-codes";

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

			response.write(htmlStart);

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
		options: RenderToPipeableStreamOptions,
	) => PipeableStream,
	options: RenderStreamOptions,
): Promise<void> {
	const { url, timeoutMs = 25000 } = options;
	const didErrorRef: ErrorRef = { current: false };

	const renderOptions = createRenderStreamOptions(options, didErrorRef);
	const { pipe, abort } = renderFn(url, {
		...renderOptions,
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
