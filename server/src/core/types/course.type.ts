import type { Document } from 'mongoose';
import { IUser } from './user.type';

export interface IComment extends Document {
	user: Partial<IUser>;
	comment: string;
}

export interface IReview extends Document {}
