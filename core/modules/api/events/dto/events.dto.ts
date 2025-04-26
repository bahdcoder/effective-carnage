import { z } from "zod"

export function eventsQueryParametersSchema() {
	return z.object({
		limit: z.optional(z.number().min(1)),
		offset: z.optional(z.number().min(1).max(100)),
	})
}
