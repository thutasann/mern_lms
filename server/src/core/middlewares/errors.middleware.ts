import { NextFunction, Request, Response } from 'express';
import {
	AuthorizeError,
	NotFoundError,
	ValidationError,
} from '../utils/error/errors';
import { logger } from '../utils/logger';

/**
 * Handle Error With Logger
 * @param error - error types
 * @param res - response
 * @returns
 */
export const handleErrorWithLogger = (
	error: any,
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	let reportError = true;
	let status = 500;
	let data = error.message;

	// skip common / known errors
	[NotFoundError, ValidationError, AuthorizeError].forEach((errorType) => {
		if (error instanceof errorType) {
			reportError = false;
			status = error.status;
			data = error.message;
		}
	});

	if (reportError) {
		logger.error(error);
	} else {
		logger.warn(error);
	}

	res.status(status).json(data);
};

/**
 * Hanlde UnCaught Exception
 * @param error - UncaughtException
 */
export const HandleUnCaughtException = async (error: Error) => {
	logger.error(error);
	process.exit(1);
};
