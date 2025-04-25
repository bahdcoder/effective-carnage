# Betting dashboard

## Running CLI commands

I use `@drizzle-team/brocli` for creating CLI commands. I picked this for the following reasons:

1. 100% fully typed cli commands
2. Inbuilt argument and parameter validation
3. Flexible function style command definition

To run any command, you may use the `npm run cli <command-name>` command.

For example, to seed sample events, you may run the command:

```bash
npm run cli seed_events
```
