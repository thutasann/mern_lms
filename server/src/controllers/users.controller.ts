import { NextFunction, Request, Response } from 'express';
import { CreateUserRequest } from '../core/dto/user.dto';
import { BadRequestError } from '../core/utils/error/errors';
import { RequestValidator } from '../core/utils/error/request-validator';
import { UserService } from '../services/users.service';

/**
 * User Controllers
 */
class UserControllers {
	private readonly userService: UserService;

	constructor() {
		this.userService = new UserService();
		this.registerUser = this.registerUser.bind(this);
	}

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
			return res.status(400).json(new BadRequestError(errors as string));
		}

		const result = await this.userService.createUser(input);

		return res.status(201).json(result);
	}
}

export const userController = new UserControllers();
