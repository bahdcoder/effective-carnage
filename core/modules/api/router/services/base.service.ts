import type { ModuleApplicationContext } from "@/modules/module.contract.js"
import { resolve } from "@/utils/container/resolve.js"

export class BaseService {
	constructor(protected ctx: ModuleApplicationContext) {}

	protected prisma() {
		return resolve(this.ctx.container, "prisma")
	}
}
