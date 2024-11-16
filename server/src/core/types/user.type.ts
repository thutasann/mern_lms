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
	courses: Array<{ _id: string }>;
	comparePassword: (password: string) => Promise<boolean>;
	signAccessToken: () => string;
	signRefreshToken: () => string;
}

/** Activation Token */
export type ActivationToken = {
	/** jwt token */
	token: string;
	/** activation code */
	activationCode: string;
};

/** Token Options */
export type TokenOptions = {
	expires: Date;
	maxAge: number;
	httpOnly: boolean;
	sameSite: 'lax' | 'strict' | 'none' | undefined;
	secure?: boolean;
};
