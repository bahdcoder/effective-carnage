import type { ZodError } from "zod"

/**
 * Represents validation failures from Zod schema validation.
 * Carries structured error information that can be transformed into
 * field-specific error messages for API responses.
 */
export class ValidationException<T = object> extends Error {
  constructor(public errors: ZodError<T>) {
    super("Validation failed")
  }
}
