import { Ignitor } from "@/server/ignitor/ignitor"

export class IgnitorCli extends Ignitor {
  constructor() {
    super({
      debug: true,
    })
  }

  async setup() {}

  async handle() {}
}
