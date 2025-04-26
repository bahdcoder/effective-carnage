import { NotFoundException } from "@/modules/errors/exceptions/not-found.exception.js"
import { ValidationException } from "@/modules/errors/exceptions/validation.exception.js"
import { HttpResponse } from "@/modules/http/helpers/response.helper.js"
import type { ServerResponse } from "@/modules/http/types/server-response.types.js"
import type { ModuleApplicationContext } from "@/modules/module.contract.js"
import { BaseModule } from "@/modules/shared/base.module.js"
import { resolve } from "@/utils/container/resolve.js"
import type { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"

export interface ValidationErrors {
  [key: string]: string[]
}

/**
 * Provides centralized error handling for the entire application.
 * Transforms various error types into consistent API responses with
 * appropriate status codes and user-friendly messages.
 */
export class ErrorsModule extends BaseModule {
  async register(ctx: ModuleApplicationContext) {
    this.registerGlobalErrorHandlerMiddleware(ctx)
  }

  /**
   * Registers the global error handler middleware as the last middleware
   * in the Express pipeline to catch all unhandled errors.
   */
  private registerGlobalErrorHandlerMiddleware(ctx: ModuleApplicationContext) {
    ctx.app.use(this.logAndHandleError(ctx))
  }

  /**
   * Creates an error handling middleware that logs errors before processing them.
   * Ensures all errors are properly recorded for monitoring and debugging.
   */
  private logAndHandleError({ container }: ModuleApplicationContext) {
    const logger = resolve(container, "logger")

    return (
      error: Error | ValidationException,
      request: Request,
      response: Response,
      next: NextFunction
    ) => {
      logger.error(error)

      return this.errorHandler(error, request, response, next)
    }
  }

  /**
   * Handles different error types with appropriate responses.
   * Maps application-specific errors to HTTP status codes and
   * formats error messages for API consumers.
   */
  private errorHandler(
    error: Error | ValidationException,
    _request: Request,
    response: Response,
    _next: NextFunction
  ) {
    if (error instanceof NotFoundException) {
      new HttpResponse(response).status(StatusCodes.NOT_FOUND).json({
        message: error.message || "No resource is available at this url.",
      })

      return
    }

    if (error instanceof ValidationException) {
      const { message, errors, description } =
        this.parseZodValidationErrors(error)

      new HttpResponse(response).status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        message,
        description,
        errors,
      })

      return
    }

    new HttpResponse(response).status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Oops. Something went wrong on our end.",
      description: "We have been notified and will fix it soon.",
    })
  }

  /**
   * Transforms Zod validation errors into a structured format.
   * Groups validation issues by field for easier client-side handling.
   */
  private parseZodValidationErrors(error: ValidationException) {
    const errors: Record<string, string[]> = {}

    for (const issue of error.errors.issues) {
      const field = issue.path[0]

      if (!errors[field]) {
        errors[field] = []
      }

      errors[field].push(issue.message)
    }

    return {
      message: "Validation failed.",
      description: "The data you provided did not match our validation rules.",
      errors,
    } satisfies ServerResponse
  }
}
