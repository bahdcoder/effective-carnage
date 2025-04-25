import { ApplicationEnv } from "@/modules/env/env.module";
import { ApplicationConfig } from "@/modules/config/config.module";
import { AwilixContainer } from "awilix";
import { RedisClientType } from "redis";
import { PrismaClient } from "@prisma/client";
import { Logger } from "pino";
import { Router } from "express";
import { EventsService } from "@/modules/api/events/services/events.service";
import { UsersService } from "@/modules/api/auth/services/users.service";

export type ContainerServicesKeys = "eventsService";

export type ContainerKeys =
	| "env"
	| "config"
	| "redis"
	| "prisma"
	| "logger"
	| "router"

	// services
	| "eventsService"
	| "usersService";

export type ContainerValues = {
	env: Readonly<ApplicationEnv>;
	config: Readonly<ApplicationConfig>;
	redis: RedisClientType;
	prisma: PrismaClient;
	logger: Logger;
	router: Router;

	// services
	eventsService: EventsService;
	usersService: UsersService;
};

export function resolve<ContainerKey extends ContainerKeys>(
	container: AwilixContainer,
	key: ContainerKey,
) {
	return container.resolve<ContainerValues[ContainerKey]>(key);
}
