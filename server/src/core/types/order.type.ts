import { Document } from 'mongoose';

export interface IOrder extends Document {
	courseId: string;
	userId: string;
	payment_info: object;
}
