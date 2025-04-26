import type { ApplicationEnv } from "@/modules/env/env.module.js"
import type { ApplicationConfig } from "@/modules/config/config.module.js"
import type { AwilixContainer } from "awilix"
import type { RedisClientType } from "redis"
import type { PrismaClient } from "@prisma/client"
import type { Logger } from "pino"
import type { Router } from "express"
import type { EventsService } from "@/modules/api/events/services/events.service.js"
import type { UsersService } from "@/modules/api/auth/services/users.service.js"
import type { BetsService } from "@/modules/api/bets/services/bets.service.js"

export type ContainerServicesKeys = "eventsService"

export type ContainerKeys =
	| "env"
	| "config"
	| "redis"
	| "prisma"
	| "logger"
	| "router"

	// services
	| "eventsService"
	| "usersService"
	| "betsService"

export type ContainerValues = {
	env: Readonly<ApplicationEnv>
	config: Readonly<ApplicationConfig>
	redis: RedisClientType
	prisma: PrismaClient
	logger: Logger
	router: Router

	// services
	eventsService: EventsService
	usersService: UsersService
	betsService: BetsService
}

export function resolve<ContainerKey extends ContainerKeys>(
	container: AwilixContainer,
	key: ContainerKey,
) {
	return container.resolve<ContainerValues[ContainerKey]>(key)
}
