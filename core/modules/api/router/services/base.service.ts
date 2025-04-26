import type { ModuleApplicationContext } from "@/modules/module.contract";
import { resolve } from "@/utils/container/resolve";

export class BaseService {
	constructor(protected ctx: ModuleApplicationContext) {}

	protected prisma() {
		return resolve(this.ctx.container, "prisma");
	}
}
