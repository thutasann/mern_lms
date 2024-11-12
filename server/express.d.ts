import { IUser } from './src/core/types/user.type';

declare global {
	namespace Express {
		interface Request {
			user: IUser;
		}
	}
}
