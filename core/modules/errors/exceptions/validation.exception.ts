import type { ZodError } from "zod"

export class ValidationException<T = object> extends Error {
  constructor(public errors: ZodError<T>) {
    super("Validation failed")
  }
}
