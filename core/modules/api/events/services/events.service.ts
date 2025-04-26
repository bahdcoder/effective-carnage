import { BaseService } from "@/modules/api/router/services/base.service";
import { getPaginationResponseData } from "@/utils/http/get-pagination-response-data";

export class EventsService extends BaseService {
	protected DEFAULT_PAGINATION_LIMIT = 10;
	protected DEFAULT_PAGINATION_OFFSET = 0;

	async events(
		limit = this.DEFAULT_PAGINATION_LIMIT,
		offset = this.DEFAULT_PAGINATION_OFFSET,
	) {
		const events = await this.prisma().event.findMany({
			skip: offset,
			take: limit,
			select: {
				id: true,
				eventName: true,
				odds: true,
			},
		});

		const count = await this.prisma().event.count();

		return getPaginationResponseData(events, count, limit, offset);
	}

	findById(id: string) {
		return this.prisma().event.findFirst({
			where: {
				id,
			},
		});
	}
}
