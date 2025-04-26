import type { Request } from "express"

export function getPaginationQueryParameters(request: Request) {
  const limit = Number.parseInt(request.query.limit as string)
  const offset = Number.parseInt(request.query.offset as string)

  return {
    limit: Number.isNaN(limit) ? undefined : limit,
    offset: Number.isNaN(offset) ? undefined : offset,
  }
}
