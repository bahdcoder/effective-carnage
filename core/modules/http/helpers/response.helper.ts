import type { ServerResponse } from "@/modules/http/types/server-response.types.js"
import type { Response } from "express"
import type { StatusCodes } from "http-status-codes"

export class HttpResponse {
	constructor(protected response: Response) {}

	status(code: StatusCodes) {
		this.response.status(code)

		return this
	}

	json(data: ServerResponse) {
		return this.response.json(data)
	}
}
