/**
 * Development server entry point.
 *
 * Bootstraps the application with development-specific features like
 * hot module replacement, on-demand compilation, and enhanced debugging.
 * This entry point is used during local development to provide
 * a fast feedback loop for developers.
 */
import { IgnitorDev } from "./ignitor/ignitor-dev.js"

const ignitor = new IgnitorDev()

await ignitor.initialize()
ignitor.start()
