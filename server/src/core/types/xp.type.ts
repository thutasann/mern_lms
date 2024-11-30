import { Document, Types } from 'mongoose';

export interface IXpHistory extends Document {
	user: Types.ObjectId;
	action: string;
	xpAwarded: number;
	date: Date;
}

export interface ICurrencyHistory extends Document {
	user: Types.ObjectId;
	amount: number;
	reason: string; // e.g., "reward", "purchase"
	date: Date;
}

export interface IUserXps extends Document {
	user: Types.ObjectId;
	totalXp: number; // Total accumulated XP
	level: number; // Current level of the user
	nextLevelXp: number; // XP required to reach the next level
	lastUpdated: Date; // Last update timestamp
}

export interface IXpLevelSetting extends Document {
	level: number; // Level number
	requiredXp: number; // XP required to reach this level
	rewards?: string; // Optional rewards for achieving this level
}
