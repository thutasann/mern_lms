import type { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';

/**
 * Request Time Middleware
 * @param req - request
 * @param res - response
 * @param next - next function
 */
export function requestTimeMiddleware(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const start = process.hrtime();
	res.on('finish', () => {
		const elapsed = process.hrtime(start);
		const elapsedTimeInMs = (elapsed[0] * 1000 + elapsed[1] / 1e6).toFixed(3);
		logger.info(`${req.method} ${req.originalUrl} [${elapsedTimeInMs}ms]`);
	});
	next();
}
