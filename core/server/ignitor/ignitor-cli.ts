import { Ignitor } from "@/server/ignitor/ignitor.js"

export class IgnitorCli extends Ignitor {
	constructor() {
		super({
			debug: true,
		})
	}

	async setup() {}

	async handle() {}
}
