import { IsEmail, IsOptional, IsString } from 'class-validator';

/** Create User Request */
export class CreateUserRequest {
	@IsString()
	name: string;

	@IsEmail()
	email: string;

	@IsString()
	password: string;

	@IsOptional()
	@IsString()
	avatar?: string;
}

/** Activate User Request */
export class ActivateUserRequest {
	@IsString()
	activation_token: string;

	@IsString()
	activation_code: string;
}
