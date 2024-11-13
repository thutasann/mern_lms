import { Response } from 'express';
import jwt, { type Secret } from 'jsonwebtoken';
import { ActivationToken, IUser, TokenOptions } from '../core/types/user.type';
import { logger } from '../core/utils/logger';
import redis from '../core/utils/redis';
import { Responer } from '../core/utils/responer';

/** access token expire time @internal */
const accessTokenExpire = parseInt(
	process.env.ACCESS_TOKEN_EXPIRE || '300',
	10,
);

/** refresh token expire time @internal */
const refreshTokenExpire = parseInt(
	process.env.REFRESH_TOKEN_EXPIRE || '1200',
	10,
);

/** options for cookies (access token) */
export const accessTokenOptions: TokenOptions = {
	expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000),
	maxAge: accessTokenExpire * 60 * 60 * 1000,
	httpOnly: true,
	sameSite: 'lax',
};

/** options for cookies (refresh token) */
export const refreshTokenOptions: TokenOptions = {
	expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
	maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
	httpOnly: true,
	sameSite: 'lax',
};

/** JWT service */
export class JwtService {
	/**
	 * Create activation token
	 * @param user - user object
	 * @returns { ActivationToken }
	 */
	createActivationToken(user: Partial<IUser>): ActivationToken {
		const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

		const token = jwt.sign(
			{
				user,
				activationCode,
			},
			process.env.JWT_SECRET as Secret,
			{ expiresIn: '5m' },
		);

		return { token, activationCode };
	}

	/**
	 * Send Access/Refresh Token to cookie
	 * @param user - user object
	 * @param statusCode - status code
	 * @param res - express response
	 */
	async sendToken(user: IUser, statusCode: number, res: Response) {
		const accessToken = user.signAccessToken();
		const refreshToken = user.signRefreshToken();

		// upload session to redis
		await redis.set(user._id as string, JSON.stringify(user));

		// only seet secure to true in production
		if (process.env.NODE_ENV === 'production') {
			accessTokenOptions.secure = true;
		}

		res.cookie('access_token', accessToken, accessTokenOptions);

		res.cookie('refresh_token', refreshToken, refreshTokenOptions);

		logger.info(`send token successful ${user.email}`);

		res.status(statusCode).json(
			Responer({
				statusCode,
				devMessage: 'AccessToken',
				message: `Sent token successfully`,
				body: {
					user,
					accessToken,
				},
			}),
		);
	}
}
