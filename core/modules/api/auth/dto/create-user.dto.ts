import type { UsersService } from "@/modules/api/auth/services/users.service.js"
import { z } from "zod"

export function createUserSchema(usersService: UsersService) {
	return z.object({
		email: z
			.string()
			.email()
			.refine(
				async (email) => {
					const user = await usersService.findByEmail(email)

					return user === null
				},
				{
					message: "A user with this email already exists.",
				},
			),
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
	})
}
