import { createUserSchema } from "@/modules/api/auth/dto/create-user.dto";
import { loginUserSchema } from "@/modules/api/auth/dto/login-user.dto";
import type { UsersService } from "@/modules/api/auth/services/users.service";
import { HttpResponse } from "@/modules/http/helpers/response.helper";
import type { ModuleApplicationContext } from "@/modules/module.contract";
import { BaseController } from "@/modules/shared/controllers/base.controller";
import { resolve } from "@/utils/container/resolve";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class AuthController extends BaseController {
	protected usersService: UsersService;

	constructor(ctx: ModuleApplicationContext) {
		super(ctx);
		this.usersService = resolve(ctx.container, "usersService");
	}

	get = async (request: Request, response: Response) => {
		const userSession = request.session?.user;

		if (!userSession) {
			new HttpResponse(response).status(StatusCodes.OK).json({ data: null });

			return;
		}

		const user = await this.usersService.findByEmail(userSession.email);

		if (!user) {
			request.session = null;
			new HttpResponse(response).status(StatusCodes.OK).json({ data: null });

			return;
		}

		const { password, ...userWithoutPassword } = user;

		new HttpResponse(response)
			.status(StatusCodes.OK)
			.json({ data: userWithoutPassword });
	};

	store = async (request: Request, response: Response) => {
		const data = await this.validate(
			request.body,
			createUserSchema(this.usersService),
		);

		const { password, ...user } = await this.usersService.create(data);

		request.session = { user };

		new HttpResponse(response).status(StatusCodes.OK).json({
			data: user,
		});
	};

	destroy = async (request: Request, response: Response) => {
		request.session = null;

		response.status(StatusCodes.OK).json(undefined);
	};

	update = async (request: Request, response: Response) => {
		const data = await this.validate(request.body, loginUserSchema());

		const user = await this.usersService.findByEmail(data.email);

		const unauthorizedMessage =
			"Invalid credentials provided. Please check your email or password again.";

		if (!user) {
			new HttpResponse(response).status(StatusCodes.UNAUTHORIZED).json({
				message: unauthorizedMessage,
			});

			return;
		}

		const isPasswordCorrect = await this.usersService.confirmPassword(
			user,
			data.password,
		);

		if (!isPasswordCorrect) {
			new HttpResponse(response).status(StatusCodes.UNAUTHORIZED).json({
				message: unauthorizedMessage,
			});

			return;
		}

		const { password, ...userWithoutPassword } = user;

		request.session = { user: userWithoutPassword };

		new HttpResponse(response).status(StatusCodes.OK).json({
			message: "Logged in successfully.",
		});
	};
}
