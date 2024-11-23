import { Document } from 'mongoose';

export interface INotification extends Document {
	title: string;
	message: string;
	status: string;
	userId: string;
}
