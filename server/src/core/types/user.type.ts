import type { Document } from 'mongoose';

/** User Interface  */
export interface IUser extends Document {
	name: string;
	email: string;
	password: string;
	avatar: {
		public_id: string;
		url: string;
	};
	role: string;
	isVerified: boolean;
	courses: Array<{ courseId: string }>;
	comparePassword: (password: string) => Promise<boolean>;
}

/** Activation Token */
export type ActivationToken = {
	/** jwt token */
	token: string;
	/** activation code */
	activationCode: string;
};
