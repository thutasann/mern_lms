import { NextFunction, Request, Response } from 'express';
import { catchAsyncErrors } from '../core/decorators/catcy-async-errrors.decorator';
import { CreateUserRequest } from '../core/dto/user.dto';
import { APIError, BadRequestError } from '../core/utils/error/errors';
import { RequestValidator } from '../core/utils/error/request-validator';
import { UserService } from '../services/user.service';

/**
 * User Controllers
 */
export class UserControllers {
	private static readonly _userService: UserService;

	@catchAsyncErrors()
	static async registerUser(req: Request, res: Response, next: NextFunction) {
		try {
			const { errors, input } = await RequestValidator(
				CreateUserRequest,
				req.body,
			);

			if (errors) {
				return res.status(400).json(new BadRequestError(errors as string));
			}

			await this._userService.createUser(input);
		} catch (error: any) {
			return res.status(500).json(new APIError(error));
		}
	}
}
