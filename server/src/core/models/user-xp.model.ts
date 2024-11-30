import { model, Schema } from 'mongoose';
import { IUserXps } from '../types/xp.type';

const userXpsSchema = new Schema<IUserXps>(
	{
		user: { type: Schema.Types.ObjectId, ref: 'BIT', required: true },
		totalXp: { type: Number, default: 0 },
		level: { type: Number, default: 1 },
		nextLevelXp: { type: Number, required: true },
		lastUpdated: { type: Date, default: Date.now },
	},
	{ timestamps: true },
);

export const UserXps = model<IUserXps>('UserXps', userXpsSchema);
