import { ModuleApplicationContext } from "@/modules/module.contract";
import { BaseModule } from "@/modules/shared/base.module";
import { resolve } from "@/utils/container/resolve";

import { PrismaClient } from "@prisma/client";
import { asValue } from "awilix";

export class PrismaModule extends BaseModule {
	name = "prisma";

	async register({ container }: ModuleApplicationContext) {
		const prisma = new PrismaClient();

		await prisma.$connect();

		container.register({
			prisma: asValue(prisma),
		});
	}

	async shutdown({ container }: ModuleApplicationContext) {
		const prisma = resolve(container, "prisma");

		await prisma.$disconnect();
	}
}
