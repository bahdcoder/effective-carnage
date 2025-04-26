/**
 * Represents a resource not found error.
 * Used to signal that a requested resource doesn't exist,
 * which gets translated to a 404 HTTP response.
 */
export class NotFoundException extends Error {}
