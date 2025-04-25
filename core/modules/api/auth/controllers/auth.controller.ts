import { UsersService } from "@/modules/api/auth/services/users.service";
import { ModuleApplicationContext } from "@/modules/module.contract";
import { BaseController } from "@/modules/shared/controllers/base.controller";
import { resolve } from "@/utils/container/resolve";
import { Request, Response } from "express";

export class AuthController extends BaseController {
	protected usersService: UsersService;

	constructor(ctx: ModuleApplicationContext) {
		super(ctx);
		this.usersService = resolve(ctx.container, "usersService");
	}

	store = async (request: Request, response: Response) => {
  
		response.json([]);
	};
}
