import { z } from "zod";

export function loginUserSchema() {
	return z.object({
		email: z.string().email(),
		password: z.string().min(8).max(32),
	});
}
