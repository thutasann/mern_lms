import jwt from 'jsonwebtoken';
import { ActivateUserRequest, CreateUserRequest } from '../core/dto/user.dto';
import userModel from '../core/models/user.model';
import { IUser } from '../core/types/user.type';
import { APIError, BadRequestError } from '../core/utils/error/errors';
import { Responer } from '../core/utils/responer';
import { EmailService } from './email.service';
import { JwtService } from './jwt.service';

/**
 * User Service
 */
export class UserService {
	constructor(
		private readonly _jwtService: JwtService,
		private readonly _emailService: EmailService,
	) {}

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

			await this._emailService.sendEmail({
				email: user.email,
				subject: 'Activate your account!',
				tempate: 'activation-mail.ejs',
				data,
			});

			return Responer({
				statusCode: 201,
				devMessage: 'Activation email sent successfully',
				message: `Please check your email: ${user.email} to activate your account!`,
				body: {
					activationToken: activationToken.token,
				},
			});
		} catch (error) {
			throw new APIError(`Error in creating user: ${error}`);
		}
	}

	/** activate uesr */
	async activateUser(body: ActivateUserRequest) {
		try {
			const { activation_token, activation_code } = body;

			const newUser = jwt.verify(
				activation_token,
				process.env.JWT_SECRET as string,
			) as { user: IUser; activationCode: string };

			if (newUser.activationCode !== activation_code) {
				throw new BadRequestError('Invalid Activation code');
			}

			const { name, email, password } = newUser.user;

			const existedUser = await userModel.findOne({ email });

			if (existedUser) {
				throw new BadRequestError(`Email already exist`);
			}

			const user = await userModel.create({
				name,
				email,
				password,
			});

			return Responer({
				statusCode: 201,
				devMessage: 'Activated and Registered User Success',
				message: `Registered account succcessfully`,
				body: user,
			});
		} catch (error) {
			throw new APIError(`Error in activating user: ${error}`);
		}
	}
}
