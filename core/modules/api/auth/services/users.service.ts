import { Prisma, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { BaseService } from "@/modules/api/router/services/base.service";

export class UsersService extends BaseService {
	async create(user: Prisma.UserCreateInput) {
		return this.prisma().user.create({
			data: { ...user, password: await this.hashPassword(user.password) },
		});
	}

	async confirmPassword(user: User, plainPassword: string) {
		return bcrypt.compare(plainPassword, user.password);
	}

	protected hashPassword(password: string) {
		return bcrypt.hash(password, 10);
	}
}
