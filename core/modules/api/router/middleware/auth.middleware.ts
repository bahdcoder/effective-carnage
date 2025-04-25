import { BaseMiddleware } from "@/modules/shared/middleware/base.middleware";
import { Request, Response, NextFunction } from "express";

export class AuthMiddleware extends BaseMiddleware {
	handle = async (request: Request, response: Response, next: NextFunction) => {
		this.ctx.logger.info(`Auth middleware called.`);
		next();
	};
}
