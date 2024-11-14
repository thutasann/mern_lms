import type { Request, Response } from 'express';
import { catchAsyncErrors } from '../core/decorators/catcy-async-errrors.decorator';
import {
	UserPasswordUpdateRequest,
	UserUpdateRequest,
} from '../core/dto/user.dto';
import { RequestValidator } from '../core/utils/error/request-validator';
import { logger } from '../core/utils/logger';
import { Responer } from '../core/utils/responer';
import { EmailService } from '../services/email.service';
import { JwtService } from '../services/jwt.service';
import { UserService } from '../services/users.service';

/** User CRUD Controllers */
class UserCRUDControllers {
	constructor(private readonly userService: UserService) {
		this.updateUser = this.updateUser.bind(this);
		this.updateUserPasasword = this.updateUserPasasword.bind(this);
	}

	@catchAsyncErrors()
	public async updateUser(req: Request, res: Response | any) {
		try {
			const { name, email } = req.body as UserUpdateRequest;
			const userId = req?.user?._id;
			const updatedUser = await userService.updateUserInfo(
				{ name, email },
				userId as string,
			);
			return res.status(201).json(updatedUser);
		} catch (error) {
			return res.status(500).json(
				Responer({
					statusCode: 500,
					message: error,
					devMessage: `User update Failed`,
					body: { error },
				}),
			);
		}
	}

	@catchAsyncErrors()
	public async updateUserPasasword(req: Request, res: Response | any) {
		const { errors, input } = await RequestValidator(
			UserPasswordUpdateRequest,
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
			const _id = req?.user?._id as string;

			if (!_id) {
				return res.status(403).json(
					Responer({
						statusCode: 403,
						message: 'Unauthorized',
						devMessage: 'Please login first to update password',
						body: {},
					}),
				);
			}

			const result = await this.userService.updateUserPassword(input, _id);
			return res.status(201).json(result);
		} catch (error: any) {
			logger.error(`Errors at Update Password user: ${error.message}`);
			return res.status(500).json(
				Responer({
					statusCode: 500,
					message: error,
					devMessage: `Something went wrong in Update Password User`,
					body: { error: error.message },
				}),
			);
		}
	}
}

const userService = new UserService(new JwtService(), new EmailService());
export const userCRUDController = new UserCRUDControllers(userService);
