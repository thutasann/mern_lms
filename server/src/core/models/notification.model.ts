import mongoose, { Model, Schema } from 'mongoose';
import { INotification } from '../types/notification.type';

const notificationSchema: Schema<INotification> =
	new mongoose.Schema<INotification>(
		{
			title: {
				type: String,
				required: true,
			},
			message: {
				type: String,
				required: true,
			},
			status: {
				type: String,
				required: true,
				default: 'unread',
			},
		},
		{ timestamps: true },
	);

const notificationModel: Model<INotification> = mongoose.model(
	'Notification',
	notificationSchema,
);

export default notificationModel;
