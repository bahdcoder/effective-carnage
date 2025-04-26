import { NotFoundException } from "@/modules/errors/exceptions/not-found.exception";
import { ValidationException } from "@/modules/errors/exceptions/validation.exception";
import { HttpResponse } from "@/modules/http/helpers/response.helper";
import type { ServerResponse } from "@/modules/http/types/server-response.types";
import type { ModuleApplicationContext } from "@/modules/module.contract";
import { BaseModule } from "@/modules/shared/base.module";
import { resolve } from "@/utils/container/resolve";
import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export interface ValidationErrors {
	[key: string]: string[];
}

export class ErrorsModule extends BaseModule {
	async register(ctx: ModuleApplicationContext) {
		this.registerGlobalErrorHandlerMiddleware(ctx);
	}

	private registerGlobalErrorHandlerMiddleware(ctx: ModuleApplicationContext) {
		ctx.app.use(this.logAndHandleError(ctx));
	}

	private logAndHandleError({ container }: ModuleApplicationContext) {
		const logger = resolve(container, "logger");

		return (
			error: Error | ValidationException,
			request: Request,
			response: Response,
			next: NextFunction,
		) => {
			logger.error(error);

			return this.errorHandler(error, request, response, next);
		};
	}

	private errorHandler(
		error: Error | ValidationException,
		_request: Request,
		response: Response,
		_next: NextFunction,
	) {
		if (error instanceof NotFoundException) {
			new HttpResponse(response).status(StatusCodes.NOT_FOUND).json({
				message: error.message || "No resource is available at this url.",
			});

			return;
		}

		if (error instanceof ValidationException) {
			const { message, errors, description } =
				this.parseZodValidationErrors(error);

			new HttpResponse(response).status(StatusCodes.UNPROCESSABLE_ENTITY).json({
				message,
				description,
				errors,
			});

			return;
		}

		new HttpResponse(response).status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: "Oops. Something went wrong on our end.",
			description: "We have been notified and will fix it soon.",
		});
	}

	private parseZodValidationErrors(error: ValidationException) {
		const errors: Record<string, string[]> = {};

		for (const issue of error.errors.issues) {
			const field = issue.path[0];

			if (!errors[field]) {
				errors[field] = [];
			}

			errors[field].push(issue.message);
		}

		return {
			message: "Validation failed.",
			description: "The data you provided did not match our validation rules.",
			errors,
		} satisfies ServerResponse;
	}
}
