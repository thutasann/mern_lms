import bcrypt from 'bcryptjs';
import mongoose, { type Model, type Schema } from 'mongoose';
import { IUser } from '../types/user.type';

const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * User Schema
 */
const userSchema: Schema<IUser> = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please enter your name'],
		},
		email: {
			type: String,
			required: [true, 'Please enter your email'],
			validate: {
				validator: function (value: string) {
					return emailRegex.test(value);
				},
				message: 'please enter a valid email!',
			},
			unique: true,
		},
		password: {
			type: String,
			required: [true, 'Please enter your password'],
			minlength: [6, 'Password must be at least 6 characters'],
			select: false,
		},
		avatar: {
			public_id: String,
			url: String,
		},
		role: {
			type: String,
			default: 'user',
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		courses: [
			{
				courseId: String,
			},
		],
	},
	{ timestamps: true },
);

// password hash before hashing
userSchema.pre<IUser>('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}
	this.password = await bcrypt.hash(this.password, 10);
	next();
});

// compare password
userSchema.methods.comparePassword = async function (
	enteredPassword: string,
): Promise<boolean> {
	return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * User Model
 */
const userModel: Model<IUser> = mongoose.model('User', userSchema);

export default userModel;
