import { seedEventsCommand } from "@/cli/commands/seed_events";
import { run } from "@drizzle-team/brocli";

run([seedEventsCommand()]);
