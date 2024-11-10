import jwt, { type Secret } from 'jsonwebtoken';
import { ActivationToken, IUser } from '../core/types/user.type';

/**
 * JWT service
 */
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
}
