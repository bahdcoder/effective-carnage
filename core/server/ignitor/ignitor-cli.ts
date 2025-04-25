import { Ignitor } from "@/server/ignitor/ignitor";
import { resolve } from "@/utils/container/resolve";

export class IgnitorCli extends Ignitor {
	constructor() {
		super({
			debug: true,
		});
	}

	async setup() {}

	async handle() {}

	ctx() {
		const prisma = resolve(this.container, "prisma");
		const logger = resolve(this.container, "logger");

		return {
			prisma,
			logger,
			container: this.container,
		};
	}
}
