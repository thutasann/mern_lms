import { STATUS_CODES } from './status-codes';

/**
 * Base Error
 */
class BaseError extends Error {
	public readonly name: string;
	public readonly status: number;
	public readonly message: string;

	constructor(name: string, stauts: number, description: string) {
		super(description);
		this.name = name;
		this.status = stauts;
		this.message = description;
		Object.setPrototypeOf(this, new.target.prototype);
		Error.captureStackTrace(this);
	}
}

/**
 * Internal Server Error
 */
export class APIError extends BaseError {
	constructor(description = 'api error') {
		super(
			'api internal serevr error',
			STATUS_CODES.INTERNAL_ERROR,
			description,
		);
	}
}

/**
 * 400 BadRequestError Error
 */
export class BadRequestError extends BaseError {
	constructor(description = 'bad request') {
		super('bad request', STATUS_CODES.BAD_REQUEST, description);
	}
}

/**
 * Authorize Error
 */
export class AuthorizeError extends BaseError {
	constructor(description = 'access denied') {
		super('access denied', STATUS_CODES.UN_AUTHORISED, description);
	}
}

/**
 * Not Found Error
 */
export class NotFoundError extends BaseError {
	constructor(description = 'not found') {
		super(description, STATUS_CODES.NOT_FOUND, description);
	}
}
