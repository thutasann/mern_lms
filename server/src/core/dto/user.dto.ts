/** User Register payload */
export type UserRegisterBody = {
	name: string;
	email: string;
	password: string;
	avatar?: string;
};
