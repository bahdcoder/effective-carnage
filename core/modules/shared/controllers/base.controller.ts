import { ValidationException } from "@/modules/errors/exceptions/validation.exception"
import type { ModuleApplicationContext } from "@/modules/module.contract"
import type { ZodSchema, ZodTypeDef } from "zod"

export class BaseController {
  constructor(protected ctx: ModuleApplicationContext) {}

  async validate<Output = object, Input = Output>(
    data: Input,
    schema: ZodSchema<Output, ZodTypeDef, Input>
  ) {
    const output = await schema.safeParseAsync(data)

    if (!output.success) {
      throw new ValidationException(output.error)
    }

    return output.data as Output
  }
}
