import type { Request, Response } from 'express';
import { catchAsyncErrors } from '../core/decorators/catcy-async-errrors.decorator';
import {
	UserPasswordUpdateRequest,
	UserUpdateRequest,
} from '../core/dto/user.dto';
import { RequestValidator } from '../core/utils/error/request-validator';
import { Responer } from '../core/utils/responer';
import { EmailService } from '../services/email.service';
import { JwtService } from '../services/jwt.service';
import { UserService } from '../services/users.service';

/** User CRUD Controllers */
class UserCRUDControllers {
	constructor(private readonly userService: UserService) {
		this.updateUser = this.updateUser.bind(this);
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
	}
}

const userService = new UserService(new JwtService(), new EmailService());
export const userCRUDController = new UserCRUDControllers(userService);
