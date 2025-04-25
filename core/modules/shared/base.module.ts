import {
  ModuleApplicationContext,
  ModuleContract,
} from "@/modules/module.contract"

export class BaseModule implements ModuleContract {
  name = "base"

  async register(_ctx: ModuleApplicationContext) {}

  async shutdown(_ctx: ModuleApplicationContext) {}
}
