import { ApplicationEnv } from "@/modules/env/env.module"
import { ApplicationConfig } from "@/modules/config/config.module"
import { AwilixContainer } from "awilix"
import { RedisClientType } from "redis"
import { PrismaClient } from "@prisma/client"
import { Logger } from "pino"

export type ContainerKeys = "env" | "config" | "redis" | "prisma" | "logger"

export type ContainerValues = {
  env: Readonly<ApplicationEnv>
  config: Readonly<ApplicationConfig>
  redis: RedisClientType
  prisma: PrismaClient
  logger: Logger
}

export function resolve<ContainerKey extends ContainerKeys>(
  container: AwilixContainer,
  key: ContainerKey
) {
  return container.resolve<ContainerValues[ContainerKey]>(key)
}
