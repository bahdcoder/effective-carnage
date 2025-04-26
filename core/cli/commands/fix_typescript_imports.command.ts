import { IgnitorCli } from "@/server/ignitor/ignitor-cli"
import { command } from "@drizzle-team/brocli"
import fs from "node:fs/promises"
import path from "node:path"
import type { Logger } from "pino"

/**
 * Recursively traverses directories to find all JavaScript files.
 * Handles nested directory structures to ensure all compiled JS files are processed.
 */
async function findJsFiles(dir: string): Promise<string[]> {
	const files: string[] = []
	const entries = await fs.readdir(dir, { withFileTypes: true })

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name)

		if (entry.isDirectory()) {
			files.push(...(await findJsFiles(fullPath)))
		} else if (entry.isFile() && entry.name.endsWith(".js")) {
			files.push(fullPath)
		}
	}

	return files
}

/**
 * Computes the correct relative path from a file to the build root.
 * Essential for transforming TypeScript path aliases into valid relative imports
 * that work in the compiled JavaScript output.
 */
function getRelativePathToCore(filePath: string): string {
	const fileDir = path.dirname(filePath)
	const relativeToBuild = path.relative(fileDir, "build")
	return relativeToBuild === "" ? "./" : `${relativeToBuild}/`
}

/**
 * Transforms TypeScript path aliases in compiled JavaScript files.
 * Handles both @/ (core) and @app/ (app-specific) aliases by replacing them
 * with the correct relative paths based on each file's location.
 */
async function fixImportsInFile(
	filePath: string,
	logger: Logger,
): Promise<void> {
	try {
		const content = await fs.readFile(filePath, "utf-8")
		const relativeToCore = getRelativePathToCore(filePath)

		const fixedContent = content
			.replace(
				/(from\s+["']|import\s+["']|export\s+(?:(?:{\s*[\w\s,]+\s*}|\*\s+as\s+\w+)\s+from\s+["']))@\/(.*?)["']/g,
				(_match, importPrefix, importPath) => {
					return `${importPrefix}${relativeToCore}${importPath}"`
				},
			)
			.replace(
				/(from\s+["']|import\s+["']|export\s+(?:(?:{\s*[\w\s,]+\s*}|\*\s+as\s+\w+)\s+from\s+["']))@app\/(.*?)["']/g,
				(_match, importPrefix, importPath) => {
					return `${importPrefix}${relativeToCore}core/app/${importPath}"`
				},
			)

		if (content !== fixedContent) {
			await fs.writeFile(filePath, fixedContent, "utf-8")
			return logger.info(`Fixed imports in ${filePath}`)
		}

		logger.info(`No changes needed in ${filePath}`)
	} catch (error) {
		console.error(`Error processing ${filePath}:`, error)
	}
}

/**
 * CLI command that fixes TypeScript path aliases in compiled JavaScript.
 * Solves the problem where TypeScript's path mapping doesn't translate to the
 * compiled JavaScript, causing runtime import errors with module resolution.
 */
export function fixTypescriptImportsCommand() {
	return command({
		name: "fix_typescript_imports",
		desc: "Rewrite import aliases in bundled files.",
		async handler() {
			const ignitor = new IgnitorCli()

			await ignitor.initialize()
			const { logger } = ignitor.ctx()
			logger.info("Fixing TypeScript imports in build directory...")

			try {
				const files = await findJsFiles("build")
				logger.info(`Found ${files.length} JavaScript files`)

				await Promise.all(files.map((file) => fixImportsInFile(file, logger)))

				logger.info("Import paths fixed successfully!")
			} catch (error) {
				logger.error("Error fixing imports:", error)
			}

			await ignitor.shutdown()
		},
	})
}
