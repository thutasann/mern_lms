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
