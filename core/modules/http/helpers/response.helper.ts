import type { ServerResponse } from "@/modules/http/types/server-response.types.js"
import type { Response } from "express"
import type { StatusCodes } from "http-status-codes"

/**
 * Provides a fluent interface for building HTTP responses.
 * Ensures consistent response formatting across the application
 * and enforces type safety for response data.
 */
export class HttpResponse {
  constructor(protected response: Response) {}

  /**
   * Sets the HTTP status code for the response.
   * Returns this instance for method chaining.
   */
  status(code: StatusCodes) {
    this.response.status(code)

    return this
  }

  /**
   * Sends a JSON response with the provided data.
   * Ensures the response conforms to the ServerResponse type.
   */
  json(data: ServerResponse) {
    return this.response.json(data)
  }
}
