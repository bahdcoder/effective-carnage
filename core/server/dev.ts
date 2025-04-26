/**
 * Development server entry point
 *
 * This file initializes the development server implementation.
 */
import { IgnitorDev } from "./ignitor/ignitor-dev.js"

const ignitor = new IgnitorDev()

await ignitor.initialize()
ignitor.start()
