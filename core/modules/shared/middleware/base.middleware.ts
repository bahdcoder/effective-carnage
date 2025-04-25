import { ModuleApplicationContext } from "@/modules/module.contract";
import { Request, Response, NextFunction } from "express";

export abstract class BaseMiddleware {
	constructor(protected ctx: ModuleApplicationContext) {}

	protected abstract handle(
		request: Request,
		response: Response,
		next: NextFunction,
	): Promise<void>;
}
