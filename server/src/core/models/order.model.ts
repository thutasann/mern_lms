import mongoose, { Model, Schema } from 'mongoose';
import { IOrder } from '../types/order.type';

const orderSchema: Schema<IOrder> = new mongoose.Schema<IOrder>(
	{
		courseId: {
			type: String,
			required: true,
		},
		userId: {
			type: String,
			required: true,
		},
		payment_info: {
			type: Object,
		},
	},
	{ timestamps: true },
);

const orderModel: Model<IOrder> = mongoose.model('Order', orderSchema);
export default orderModel;
