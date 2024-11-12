import { NextFunction, Request } from 'express';
import jwt from 'jsonwebtoken';
import { AuthorizeError, NotFoundError } from '../utils/error/errors';
import redis from '../utils/redis';

/**
 * Auth Middleware
 * @param req - exprees request
 * @param res - express response
 * @param next - next function
 */
export const isAuthenticated = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	const access_token = req.cookies.access_token;

	if (!access_token) {
		return next(new AuthorizeError('Please login to access this resource'));
	}

	const decoded = jwt.verify(
		access_token,
		process.env.ACCEESS_TOKEN as string,
	) as any;

	if (!decoded) {
		return next(new AuthorizeError('Access token is not valid!'));
	}

	const user = await redis.get(decoded._id);

	if (!user) {
		return next(new NotFoundError('User not found'));
	}

	req.user = JSON.parse(user);

	next();
};
