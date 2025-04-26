import type { Response } from "express"
import type {
	PipeableStream,
	RenderToPipeableStreamOptions,
} from "react-dom/server"
import type { Transform } from "node:stream"
import type { Logger } from "pino"
import { createTransformStream } from "@/utils/http/create-stream.js"
import { StatusCodes } from "http-status-codes"
import type { SessionState } from "@/app/state/session-state.js"

export interface ErrorRef {
	current: boolean
}

export interface RenderStreamOptions {
	url: string
	template: string
	response: Response
	logger: Logger
	timeoutMs?: number
	sessionState?: SessionState
}

export interface CustomRenderOptions extends RenderToPipeableStreamOptions {
	onShellReady: () => Transform
}

/**
 * Creates render stream options with comprehensive error handling for React SSR.
 * Configures error boundaries at different stages of the rendering process
 * and prepares the response with appropriate status codes and content types.
 */
export function createRenderStreamOptions(
	options: RenderStreamOptions,
	didErrorRef: ErrorRef,
): CustomRenderOptions {
	const { response, logger, template } = options

	return {
		onShellError: (error: unknown): void => {
			logger.error(
				"Shell error:",
				error instanceof Error ? error : String(error),
			)
			response.status(500)
			response.set({ "Content-Type": "text/html" })
			response.send("<h1>Something went wrong</h1>")
		},
		onShellReady: (): Transform => {
			response.status(
				didErrorRef.current
					? StatusCodes.INTERNAL_SERVER_ERROR
					: StatusCodes.OK,
			)
			response.set({ "Content-Type": "text/html" })

			const transformStream = createTransformStream(response)
			const [htmlStart, htmlEnd] = template.split("<!--app-html-->")

			const sessionScript = options.sessionState
				? `<script>window.__SESSION_DATA__ = ${JSON.stringify(
						options.sessionState,
					)};</script>`
				: ""

			response.write(htmlStart + sessionScript)

			transformStream.on("finish", () => {
				response.end(htmlEnd)
			})

			return transformStream
		},
		onError: (error: unknown): void => {
			didErrorRef.current = true
			logger.error(error instanceof Error ? error : String(error))
		},
	}
}

/**
 * Orchestrates the React server-side rendering process with stream support.
 * Handles the complete lifecycle of SSR including error boundaries, timeouts,
 * and session state hydration for client-side rehydration.
 */
export async function renderReactStream(
	renderFn: (
		url: string,
		options: RenderToPipeableStreamOptions & { sessionState?: SessionState },
	) => PipeableStream,
	options: RenderStreamOptions,
): Promise<void> {
	const { url, timeoutMs = 25000, sessionState } = options
	const didErrorRef: ErrorRef = { current: false }

	const renderOptions = createRenderStreamOptions(options, didErrorRef)
	const { pipe, abort } = renderFn(url, {
		...renderOptions,
		sessionState,
		onShellReady: (): void => {
			const transformStream = renderOptions.onShellReady()
			pipe(transformStream)
		},
	})

	setTimeout(() => {
		abort()
	}, timeoutMs)
}
