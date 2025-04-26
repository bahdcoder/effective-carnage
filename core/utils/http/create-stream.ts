import type { Response } from "express"
import { Transform, type TransformCallback } from "node:stream"

/**
 * Creates a Node.js transform stream that pipes React SSR output directly to an Express response.
 * This enables streaming server-rendered content to the client without buffering the entire output,
 * improving time-to-first-byte and memory efficiency during rendering.
 */
export function createTransformStream(res: Response): Transform {
	return new Transform({
		transform(
			chunk: Buffer | string,
			encoding: BufferEncoding,
			callback: TransformCallback,
		): void {
			res.write(chunk, encoding)
			callback()
		},
	})
}
