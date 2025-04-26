import fs from "node:fs/promises"
import path from "node:path"
import { command } from "@drizzle-team/brocli"

export const fixTypescriptImportsCommand = command({
  name: "fix_typescript_imports",
  desc: "Rewrite import aliases in bundled files.",
  async transform(opts) {
    return opts
  },
  async handler() {},
})
