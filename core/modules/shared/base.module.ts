import type {
	ModuleApplicationContext,
	ModuleContract,
} from "@/modules/module.contract.js"

export class BaseModule implements ModuleContract {
	name = "base"

	async register(_ctx: ModuleApplicationContext) {}

	async shutdown(_ctx: ModuleApplicationContext) {}
}
