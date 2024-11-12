import { NextFunction, Request, Response } from 'express';
import { catchAsyncErrors } from '../core/decorators/catcy-async-errrors.decorator';
import {
	ActivateUserRequest,
	CreateUserRequest,
	LoginRequest,
} from '../core/dto/user.dto';
import { RequestValidator } from '../core/utils/error/request-validator';
import { logger } from '../core/utils/logger';
import redis from '../core/utils/redis';
import { Responer } from '../core/utils/responer';
import { EmailService } from '../services/email.service';
import { JwtService } from '../services/jwt.service';
import { UserService } from '../services/users.service';

/** User Controllers */
class UserControllers {
	constructor(private readonly userService: UserService) {
		this.registerUser = this.registerUser.bind(this);
		this.activeUser = this.activeUser.bind(this);
		this.loginUser = this.loginUser.bind(this);
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
}

const userService = new UserService(new JwtService(), new EmailService());
export const userController = new UserControllers(userService);
