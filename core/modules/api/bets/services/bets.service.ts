import { BaseService } from "@/modules/api/router/services/base.service.js"
import type { Prisma } from "@prisma/client"

/**
 * Manages betting operations and bet record persistence.
 * Handles the creation and tracking of user bets on sports events.
 */
export class BetsService extends BaseService {
  /**
   * Creates a new bet record with the specified details.
   * Establishes relationships between users, events, and bet amounts.
   */
  async create(bet: Prisma.BetCreateInput) {
    return this.prisma().bet.create({
      data: bet,
    })
  }
}
