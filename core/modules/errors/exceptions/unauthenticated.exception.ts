export class UnauthenticatedException extends Error {
	constructor(message = "You are not authenticated.") {
		super(message);
	}
}
