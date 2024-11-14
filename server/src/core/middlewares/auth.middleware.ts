import { NextFunction, Request } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { IUser } from '../types/user.type';
import { AuthorizeError, NotFoundError } from '../utils/error/errors';
import { logger } from '../utils/logger';
import redis from '../utils/redis';
import { Responer } from '../utils/responer';

declare global {
	namespace Express {
		interface Request {
			user: IUser;
		}
	}
}

interface JwtDecodedPayload extends JwtPayload {
	id: string;
}

/**
 * Auth Middleware
 * @param req - exprees request
 * @param res - express response
 * @param next - next function
 */
export const isAuthenticated = async (
	req: Request,
	res: Response | any,
	next: NextFunction,
) => {
	try {
		const access_token = req.cookies.access_token;
		logger.info(`:: Validating access token for request ::`);

		if (!access_token || access_token === 'undefined') {
			logger.warn('No access token provided in request');
			return res.status(401).json(
				Responer({
					statusCode: 401,
					message: 'Authentication required',
					devMessage: 'No access token provided',
					body: null,
				}),
			);
		}

		let decoded: JwtDecodedPayload;
		try {
			decoded = jwt.verify(
				access_token,
				process.env.ACCEESS_TOKEN as string,
			) as JwtDecodedPayload;
		} catch (error: any) {
			logger.error(`Token verification failed: ${error.message}`);
			return next(
				new AuthorizeError(
					error.name === 'TokenExpiredError'
						? 'Access token has expired'
						: 'Invalid access token',
				),
			);
		}

		const user = (await Promise.race([
			redis.get(decoded.id),
			new Promise((_, reject) =>
				setTimeout(() => reject(new Error('Redis timeout')), 5000),
			),
		])) as any;

		if (!user) {
			logger.warn(`User not found in Redis for ID: ${decoded.id}`);
			return next(new NotFoundError('User session expired'));
		}

		try {
			req.user = JSON.parse(user);
			logger.info(`:: Auth Middleware --> ${req?.user?.email} ::`);
		} catch (error: any) {
			logger.error(`Failed to parse user data: ${error.message}`);
			return next(new Error('Invalid user data format'));
		}

		logger.info(`Authentication successful for user: ${req.user.email}`);
		next();
	} catch (error: any) {
		logger.error(`Authentication middleware error: ${error.message}`);
		return next(new AuthorizeError('Authentication failed'));
	}
};

/**
 * authorize roles middleware
 * @param roles - roles
 */
export const authorizeRole = (...roles: string[]) => {
	return (req: Request, res: Response | any, next: NextFunction) => {
		if (!roles.includes(req?.user?.role || '')) {
			return next(
				new AuthorizeError(
					`Role: ${req.user?.role} is not allowed to access this resource`,
				),
			);
		}
		next();
	};
};
