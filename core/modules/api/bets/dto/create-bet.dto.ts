import z from "zod"

export function createBetSchema() {
	return z.object({
		amount: z
			.number()
			.gt(1, "Please provide an amount greater than 1.")
			.lt(1000, "Please provide an amount less than 1000."),
	})
}
