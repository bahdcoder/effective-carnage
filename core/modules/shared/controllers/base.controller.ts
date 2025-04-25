import { ModuleApplicationContext } from "@/modules/module.contract";
import { ZodSchema, ZodTypeDef } from "zod";

export class BaseController {
	constructor(protected ctx: ModuleApplicationContext) {}

	async validate<Output = any, Input = Output>(
		data: Input,
		schema: ZodSchema<Output, ZodTypeDef, Input>,
	) {
		const output = schema.safeParse(data);

		if (!output.success) {
		}

		return output.data;
	}
}
