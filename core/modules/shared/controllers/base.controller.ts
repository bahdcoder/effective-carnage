import { ValidationException } from "@/modules/errors/exceptions/validation.exception.js"
import type { ModuleApplicationContext } from "@/modules/module.contract.js"
import type { ZodSchema, ZodTypeDef } from "zod"

/**
 * Provides common functionality for all API controllers.
 * Centralizes validation logic and access to application context.
 */
export class BaseController {
	constructor(protected ctx: ModuleApplicationContext) {}

	/**
	 * Validates input data against a Zod schema.
	 * Throws a ValidationException with structured error information when validation fails,
	 * which is caught by the global error handler and transformed into a consistent API response.
	 */
	async validate<Output = object, Input = Output>(
		data: Input,
		schema: ZodSchema<Output, ZodTypeDef, Input>,
	) {
		const output = await schema.safeParseAsync(data)

		if (!output.success) {
			throw new ValidationException(output.error)
		}

		return output.data as Output
	}
}
