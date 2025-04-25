import { z } from "zod";

export function createUserSchema() {
	return z.object({
		email: z.string().email(),
		password: z
			.string()
			.min(8)
			.max(32)
			.refine((password) => /[A-Z]/.test(password), {
				message: "Your password must contain an uppercase letter.",
			})
			.refine((password) => /[a-z]/.test(password), {
				message: "Your password must contain a lowercase letter.",
			})
			.refine((password) => /[0-9]/.test(password), {
				message: "Your password must contain at least one number",
			})
			.refine((password) => /[!@#$%^&*]/.test(password), {
				message: "Your password must contain at least one special character.",
			}),
	});
}
