import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose, { type Model, type Schema } from 'mongoose';
import { IUser } from '../types/user.type';
import { emailRegex } from '../utils/constants';

/** User Schema */
const userSchema: Schema<IUser> = new mongoose.Schema<IUser>(
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
				_id: String,
			},
		],
	},
	{ timestamps: true },
);

// password hash
userSchema.pre<IUser>('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}
	this.password = await bcrypt.hash(this.password, 10);
	next();
});

// sign access token
userSchema.methods.signAccessToken = function () {
	return jwt.sign({ id: this._id }, process.env.ACCEESS_TOKEN || '', {
		expiresIn: '5m',
	});
};

// sign refresh token
userSchema.methods.signRefreshToken = function () {
	return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || '', {
		expiresIn: '3d',
	});
};

// compare password
userSchema.methods.comparePassword = async function (
	enteredPassword: string,
): Promise<boolean> {
	return await bcrypt.compare(enteredPassword, this.password);
};

/** User Model */
const userModel: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default userModel;
