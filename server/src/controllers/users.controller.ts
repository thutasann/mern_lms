import { NextFunction, Request, Response } from 'express';
import { catchAsyncErrors } from '../core/decorators/catcy-async-errrors.decorator';
import { CreateUserRequest } from '../core/dto/user.dto';
import { RequestValidator } from '../core/utils/error/request-validator';
import { Responer } from '../core/utils/responer';
import { EmailService } from '../services/email.service';
import { JwtService } from '../services/jwt.service';
import { UserService } from '../services/users.service';

/**
 * User Controllers
 */
class UserControllers {
	constructor(private readonly userService: UserService) {
		this.registerUser = this.registerUser.bind(this);
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

		const result = await this.userService.createUser(input);

		return res.status(201).json(result);
	}

	public async activeUser() {}
}

const jwtService = new JwtService();
const emailService = new EmailService();
const userService = new UserService(jwtService, emailService);
export const userController = new UserControllers(userService);
