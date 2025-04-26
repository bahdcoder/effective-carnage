import { BaseService } from "@/modules/api/router/services/base.service.js"
import type { Prisma } from "@prisma/client"

export class BetsService extends BaseService {
	async create(bet: Prisma.BetCreateInput) {
		return this.prisma().bet.create({
			data: bet,
		})
	}
}
