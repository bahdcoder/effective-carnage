import { seedEventsCommand } from "@/cli/commands/seed_events.command.js"
import { fixTypescriptImportsCommand } from "@/cli/commands/fix_typescript_imports.command.js"
import { run } from "@drizzle-team/brocli"

run([seedEventsCommand(), fixTypescriptImportsCommand()])
