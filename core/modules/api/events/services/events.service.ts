import { BaseService } from "@/modules/api/router/services/base.service.js"
import { getPaginationResponseData } from "@/utils/http/get-pagination-response-data.js"

/**
 * Manages sports events data access and business logic.
 * Provides paginated access to events and individual event retrieval.
 */
export class EventsService extends BaseService {
  protected DEFAULT_PAGINATION_LIMIT = 10
  protected DEFAULT_PAGINATION_OFFSET = 0

  /**
   * Retrieves a paginated list of events with optimized field selection.
   * Includes total count for pagination controls and only returns
   * necessary fields to minimize response size.
   */
  async events(
    limit = this.DEFAULT_PAGINATION_LIMIT,
    offset = this.DEFAULT_PAGINATION_OFFSET
  ) {
    const events = await this.prisma().event.findMany({
      skip: offset,
      take: limit,
      select: {
        id: true,
        eventName: true,
        odds: true,
      },
    })

    const count = await this.prisma().event.count()

    return getPaginationResponseData(events, count, limit, offset)
  }

  /**
   * Finds a specific event by its unique identifier.
   * Used for detailed event views and bet placement.
   */
  findById(id: string) {
    return this.prisma().event.findFirst({
      where: {
        id,
      },
    })
  }
}
