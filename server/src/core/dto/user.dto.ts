import {
	IsEmail,
	IsOptional,
	IsString,
	IsUrl,
	Matches,
	MaxLength,
	MinLength,
} from 'class-validator';

/** Create User Request */
export class CreateUserRequest {
	@IsString({ message: 'Name must be a string' })
	@MinLength(2, { message: 'Name must be at least 2 characters long' })
	@MaxLength(50, { message: 'Name cannot exceed 50 characters' })
	name: string;

	@IsEmail({}, { message: 'Please provide a valid email address' })
	email: string;

	@IsString({ message: 'Password must be a string' })
	@MinLength(8, { message: 'Password must be at least 8 characters long' })
	@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
		message:
			'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
	})
	password: string;

	@IsOptional()
	@IsString({ message: 'Avatar must be a string' })
	@IsUrl({}, { message: 'Avatar must be a valid URL' })
	avatar?: string;
}

/** Activate User Request */
export class ActivateUserRequest {
	@IsString({ message: 'Activation token must be a string' })
	activation_token: string;

	@IsString({ message: 'Activation code must be a string' })
	activation_code: string;
}

/** Login Request */
export class LoginRequest {
	@IsEmail({}, { message: 'Please provide a valid email address' })
	email: string;

	@IsString({ message: 'Password must be a string' })
	@MinLength(8, { message: 'Password must be at least 8 characters long' })
	password: string;
}

/** Social Auth Request */
export class SocialAuthRequest {
	@IsEmail({}, { message: 'Please provide a valid email address' })
	email: string;

	@IsString({ message: 'Name must be a string' })
	name: string;

	@IsString({ message: 'Avatar must be a string' })
	avatar: string;
}

/** User Update Request */
export class UserUpdateRequest {
	@IsString({ message: 'name must be a string' })
	name: string;

	@IsEmail({}, { message: 'Please provide a valid email address' })
	email: string;
}

/** User Password Update Request */
export class UserPasswordUpdateRequest {
	@IsString({ message: 'Old Password must be a string' })
	@MinLength(8, { message: 'Old Password must be at least 8 characters long' })
	oldPassword: string;

	@IsString({ message: 'New Password must be a string' })
	@MinLength(8, { message: 'New Password must be at least 8 characters long' })
	newPassword: string;
}

/** Avatar */
export class Avatar {
	@IsString({ message: 'public_id must be a string' })
	public_id: string;

	@IsString({ message: 'url must be a string' })
	url: string;
}

/** Update Profile Picture Update Request */
export class UpdateProfilePictureRequest {
	@IsString()
	avatar: string;
}
