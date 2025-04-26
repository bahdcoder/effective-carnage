import type { Response } from "express";
import { Transform, type TransformCallback } from "node:stream";

/**
 * Create a transform stream for piping React SSR output to the response
 * @param res Express response object
 * @returns Transform stream
 */
export function createTransformStream(res: Response): Transform {
	return new Transform({
		transform(
			chunk: Buffer | string,
			encoding: BufferEncoding,
			callback: TransformCallback,
		): void {
			res.write(chunk, encoding);
			callback();
		},
	});
}
