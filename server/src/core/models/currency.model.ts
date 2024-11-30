import { model, Schema } from 'mongoose';
import { ICurrencyHistory } from '../types/xp.type';

const currencyHistorySchema = new Schema<ICurrencyHistory>(
	{
		user: { type: Schema.Types.ObjectId, ref: 'BIT', required: true },
		amount: { type: Number, required: true },
		reason: { type: String, required: true },
		date: { type: Date, default: Date.now },
	},
	{ timestamps: true },
);

export const CurrencyHistory = model<ICurrencyHistory>(
	'CurrencyHistory',
	currencyHistorySchema,
);
