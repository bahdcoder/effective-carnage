/**
 * Production server entry point
 *
 * This file initializes the production server implementation.
 */
import { IgnitorProd } from "./ignitor/ignitor-prod.js"

const ignitor = new IgnitorProd()

await ignitor.initialize()
ignitor.start()
