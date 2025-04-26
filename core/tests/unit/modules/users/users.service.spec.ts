import bcrypt from "bcryptjs"
import { IgnitorDev } from "@/server/ignitor/ignitor-dev"
import { resolve } from "@/utils/container/resolve"
import { describe, test, beforeAll, afterAll, expect } from "vitest"

describe("users.module > users.service", () => {
	const ignitor = new IgnitorDev()

	const { container } = ignitor.ctx()

	beforeAll(async () => ignitor.initialize())
	afterAll(async () => ignitor.shutdown())

	test("can compare and verify a user's password", async () => {
		const usersService = resolve(container, "usersService")
		const prisma = resolve(container, "prisma")

		const mockUser = {
			email: `${Date.now()}-test@example.com`,
			password: "password",
		}

		const user = await prisma.user.create({
			data: {
				...mockUser,
				password: await bcrypt.hash(mockUser.password, 10),
			},
		})

		const isPasswordCorrect = await usersService.confirmPassword(
			user,
			mockUser.password,
		)

		expect(isPasswordCorrect).toBe(true)

		const checkForWrongPassword = await usersService.confirmPassword(
			user,
			"WRONG_PASSWORD",
		)

		expect(checkForWrongPassword).toBe(false)
	})
})
