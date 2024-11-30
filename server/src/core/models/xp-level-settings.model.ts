import { model, Schema } from 'mongoose';
import { IXpLevelSetting } from '../types/xp.type';

const xpLevelSettingSchema = new Schema<IXpLevelSetting>(
	{
		level: { type: Number, required: true, unique: true },
		requiredXp: { type: Number, required: true },
		rewards: { type: String },
	},
	{ timestamps: true },
);

export const XpLevelSetting = model<IXpLevelSetting>(
	'XpLevelSetting',
	xpLevelSettingSchema,
);
