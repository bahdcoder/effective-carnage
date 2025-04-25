import { Request } from "express";

export function getPaginationQueryParameters(request: Request) {
	const limit = parseInt(request.query.limit as string);
	const offset = parseInt(request.query.offset as string);

	return {
		limit: isNaN(limit) ? undefined : limit,
		offset: isNaN(offset) ? undefined : offset,
	};
}
