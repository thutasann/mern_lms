import { model, Model, Schema } from 'mongoose';
import { IXpHistory } from '../types/xp.type';

const xpHistorySchema = new Schema<IXpHistory>(
	{
		user: { type: Schema.Types.ObjectId, ref: 'BIT', required: true },
		action: { type: String, required: true },
		xpAwarded: { type: Number, required: true },
		date: { type: Date, default: Date.now },
	},
	{ timestamps: true },
);

export const xpHistoryModel: Model<IXpHistory> = model<IXpHistory>(
	'XpHistory',
	xpHistorySchema,
);
