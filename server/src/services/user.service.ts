import ejs from 'ejs';
import path from 'path';
import { CreateUserRequest } from '../core/dto/user.dto';
import userModel from '../core/models/user.model';
import { APIError, BadRequestError } from '../core/utils/error/errors';
import { EmailService } from './email.service';
import { JwtService } from './jwt.service';

/**
 * User Service
 */
export class UserService {
	private readonly _jwtService: JwtService;
	private readonly _emailService: EmailService;

	/** create user */
	async createUser(body: CreateUserRequest) {
		try {
			const { name, email, password } = body;

			const isEmailExist = await userModel.findOne({ email });

			if (isEmailExist) throw new BadRequestError('Email already exist');

			const user = {
				name,
				email,
				password,
			};

			const activationToken = this._jwtService.createActivationToken(user);
			const activationCode = activationToken.activationCode;

			const data = { user: { name: user.name }, activationCode };
			const activationMail = path.join(
				__dirname,
				'../email-templates/activation-mail.ejs',
			);

			const html = await ejs.renderFile(activationMail, data);
		} catch (error) {
			throw new APIError(`Error in creating user: ${error}`);
		}
	}
}
