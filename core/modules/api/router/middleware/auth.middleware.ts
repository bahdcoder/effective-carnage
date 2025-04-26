import { UnauthenticatedException } from "@/modules/errors/exceptions/unauthenticated.exception.js"
import { BaseMiddleware } from "@/modules/shared/middleware/base.middleware.js"
import type { Request, Response, NextFunction } from "express"

export class AuthMiddleware extends BaseMiddleware {
	handle = async (
		request: Request,
		_response: Response,
		next: NextFunction,
	) => {
		const user = request.session?.user

		if (!user) {
			throw new UnauthenticatedException()
		}

		next()
	}
}
