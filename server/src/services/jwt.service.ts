import { Response } from 'express';
import jwt, { type Secret } from 'jsonwebtoken';
import { ActivationToken, IUser, TokenOptions } from '../core/types/user.type';
import { Responer } from '../core/utils/responer';

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
	sendToken(user: IUser, statusCode: number, res: Response) {
		const accessToken = user.signAccessToken();
		const refreshToken = user.signRefreshToken();

		/** access token expire time */
		const accessTokenExpire = parseInt(
			process.env.ACCESS_TOKEN_EXPIRE || '300',
			10,
		);

		/** refresh token expire time */
		const refreshTokenExpire = parseInt(
			process.env.REFRESH_TOKEN_EXPIRE || '1200',
			10,
		);

		/** options for cookies (access token) */
		const accessTokenOptions: TokenOptions = {
			expires: new Date(Date.now() + accessTokenExpire * 1000),
			maxAge: accessTokenExpire * 1000,
			httpOnly: true,
			sameSite: 'lax',
		};

		/** options for cookies (refresh token) */
		const refreshTokenOptions: TokenOptions = {
			expires: new Date(Date.now() + refreshTokenExpire * 1000),
			maxAge: refreshTokenExpire * 1000,
			httpOnly: true,
			sameSite: 'lax',
		};

		// only seet secure to true in production
		if (process.env.NODE_ENV === 'production') {
			accessTokenOptions.secure = true;
		}

		res.cookie('access_token', accessToken, accessTokenOptions);

		res.cookie('refresh_token', refreshToken, refreshTokenOptions);

		res.status(statusCode).json(
			Responer({
				statusCode: 201,
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
