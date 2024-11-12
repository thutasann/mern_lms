import { NextFunction, Request } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../types/user.type';
import { AuthorizeError, NotFoundError } from '../utils/error/errors';
import redis from '../utils/redis';

declare global {
	namespace Express {
		interface Request {
			user: IUser;
		}
	}
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

	const user = await redis.get(decoded.id);

	if (!user) {
		return next(new NotFoundError('User not found'));
	}

	req.user = JSON.parse(user);

	next();
};
