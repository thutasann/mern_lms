import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { catchAsyncErrors } from '../core/decorators/catcy-async-errrors.decorator';
import {
	ActivateUserRequest,
	CreateUserRequest,
	LoginRequest,
	SocialAuthRequest,
} from '../core/dto/user.dto';
import { IUser } from '../core/types/user.type';
import { RequestValidator } from '../core/utils/error/request-validator';
import { logger } from '../core/utils/logger';
import redis from '../core/utils/redis';
import { Responer } from '../core/utils/responer';
import { EmailService } from '../services/email.service';
import {
	accessTokenOptions,
	JwtService,
	refreshTokenOptions,
} from '../services/jwt.service';
import { UserService } from '../services/users.service';

/** User Controllers */
class UserControllers {
	constructor(private readonly userService: UserService) {
		this.registerUser = this.registerUser.bind(this);
		this.activeUser = this.activeUser.bind(this);
		this.loginUser = this.loginUser.bind(this);
		this.getUserById = this.getUserById.bind(this);
		this.socialAuth = this.socialAuth.bind(this);
	}

	@catchAsyncErrors()
	public async registerUser(
		req: Request,
		res: Response | any,
		next: NextFunction,
	) {
		const { errors, input } = await RequestValidator(
			CreateUserRequest,
			req.body,
		);

		if (errors) {
			return res.status(400).json(
				Responer({
					statusCode: 400,
					message: errors as string,
					devMessage: 'Your Request is invalid',
					body: {},
				}),
			);
		}

		try {
			const result = await this.userService.createUser(input);
			return res.status(201).json(result);
		} catch (error: any) {
			logger.error(`Errors at register user : ${error.message}`);
			return res.status(500).json(
				Responer({
					statusCode: 500,
					message: error,
					devMessage: `Something went wrong in Creating User`,
					body: {},
				}),
			);
		}
	}

	@catchAsyncErrors()
	public async activeUser(
		req: Request,
		res: Response | any,
		next: NextFunction,
	) {
		const { errors, input } = await RequestValidator(
			ActivateUserRequest,
			req.body,
		);

		if (errors) {
			return res.status(400).json(
				Responer({
					statusCode: 400,
					message: errors as string,
					devMessage: 'Your Request is invalid',
					body: {},
				}),
			);
		}

		try {
			const result = await this.userService.activateUser(input);
			return res.status(201).json(result);
		} catch (error: any) {
			logger.error(`Errors at activating user : ${error.message}`);
			return res.status(500).json(
				Responer({
					statusCode: 500,
					message: error,
					devMessage: `Something went wrong in Activating User`,
					body: {},
				}),
			);
		}
	}

	@catchAsyncErrors()
	public async loginUser(
		req: Request,
		res: Response | any,
		next: NextFunction,
	) {
		const { errors, input } = await RequestValidator(LoginRequest, req.body);

		if (errors) {
			return res.status(400).json(
				Responer({
					statusCode: 400,
					message: errors as string,
					devMessage: 'Your Request is invalid',
					body: {},
				}),
			);
		}

		try {
			const result = await this.userService.loginUser(input, res);
			return res.status(201).json(result);
		} catch (error: any) {
			logger.error(`Errors at Login user: ${error.message}`);
			return res.status(500).json(
				Responer({
					statusCode: 500,
					message: error,
					devMessage: `Something went wrong in Loggin User`,
					body: {},
				}),
			);
		}
	}

	@catchAsyncErrors()
	public async logoutUser(
		req: Request,
		res: Response | any,
		next: NextFunction,
	) {
		try {
			const cookieOptions = {
				httpOnly: true,
				sameSite: 'lax' as const,
				secure: process.env.NODE_ENV === 'production',
			};

			res.clearCookie('access_token', cookieOptions);
			res.clearCookie('refresh_token', cookieOptions);

			const userId = req.user?._id || '';
			if (userId) {
				await redis.del(userId as string);
			}

			logger.info(
				`User logout and Removed from Redis successfully :: ${req.user.email}`,
			);

			return res.status(200).json(
				Responer({
					statusCode: 200,
					devMessage: 'Logout',
					message: 'User Logout successfully',
					body: {},
				}),
			);
		} catch (error) {
			return res.status(500).json(
				Responer({
					statusCode: 500,
					message: error,
					devMessage: `Something went wrong in User Logout`,
					body: {},
				}),
			);
		}
	}

	@catchAsyncErrors()
	public async updateAccessToken(
		req: Request,
		res: Response | any,
		next: NextFunction,
	) {
		try {
			const refresh_token = req.cookies.refresh_token as string;
			const decoded = jwt.verify(
				refresh_token,
				process.env.REFRESH_TOKEN as string,
			) as JwtPayload;

			if (!decoded) {
				return res.status(400).json(
					Responer({
						statusCode: 400,
						message: 'Could not refresh token',
						devMessage: 'Refresh Token processs is not succssful',
						body: {},
					}),
				);
			}
			const session = await redis.get(decoded.id as string);

			if (!session) {
				return res.status(400).json(
					Responer({
						statusCode: 400,
						message: 'Session is invalid',
						devMessage: 'Session is invalid',
						body: {},
					}),
				);
			}

			const user = JSON.parse(session) as IUser;
			logger.info(
				`User from redis session for refresh_token :: ${user?.email}`,
			);

			const accessToken = jwt.sign(
				{ id: user?._id },
				process.env.ACCEESS_TOKEN as string,
				{ expiresIn: '5m' },
			);

			const refreshToken = jwt.sign(
				{ id: user?._id },
				process.env.REFRESH_TOKEN as string,
				{ expiresIn: '3d' },
			);

			res.cookie('access_token', accessToken, accessTokenOptions);
			res.cookie('refresh_token', refreshToken, refreshTokenOptions);

			return res.status(200).json(
				Responer({
					statusCode: 200,
					message: 'updaed access token successfully',
					devMessage: `access token update`,
					body: {
						accessToken,
					},
				}),
			);
		} catch (error) {
			return res.status(500).json(
				Responer({
					statusCode: 500,
					message: error,
					devMessage: `Something went wrong in Refresh Token`,
					body: {},
				}),
			);
		}
	}

	@catchAsyncErrors()
	public async getUserById(
		req: Request,
		res: Response | any,
		next: NextFunction,
	) {
		try {
			const user = await this.userService.getUserById(req?.user?._id as string);
			return res.status(200).json(
				Responer({
					statusCode: 200,
					devMessage: 'Social Auth success',
					message: 'Social Auth successfully',
					body: {},
				}),
			);
		} catch (error) {
			return res.status(500).json(
				Responer({
					statusCode: 500,
					message: error,
					devMessage: `get by user Id failed`,
					body: { error },
				}),
			);
		}
	}

	@catchAsyncErrors()
	public async socialAuth(req: Request, res: Response | any) {
		try {
			const { name, email, avatar } = req.body as SocialAuthRequest;
			await this.userService.socialAuth(
				{
					name,
					email,
					avatar,
				},
				res,
			);
		} catch (error) {
			return res.status(500).json(
				Responer({
					statusCode: 500,
					message: error,
					devMessage: `social auth failed`,
					body: { error },
				}),
			);
		}
	}
}

const userService = new UserService(new JwtService(), new EmailService());
export const userController = new UserControllers(userService);
