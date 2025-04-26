/**
 * Production server entry point.
 *
 * Bootstraps the application with production-optimized settings for
 * performance, reliability, and security. Uses pre-compiled assets
 * and optimized server-side rendering for handling high-traffic loads
 * in deployed environments.
 */
import { IgnitorProd } from "./ignitor/ignitor-prod.js"

const ignitor = new IgnitorProd()

await ignitor.initialize()
ignitor.start()
