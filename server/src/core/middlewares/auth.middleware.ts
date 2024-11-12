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
	const access_token = req.cookies.access_token;
	logger.info(`access_token : ${access_token}`);

	if (!access_token) {
		return res.status(401).json(
			Responer({
				statusCode: 401,
				message: 'Authentication required',
				devMessage: 'No access token provided',
				body: null,
			}),
		);
	}

	const decoded = jwt.verify(
		access_token,
		process.env.ACCEESS_TOKEN as string,
	) as JwtDecodedPayload;

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
