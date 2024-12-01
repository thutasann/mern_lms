import mongoose from 'mongoose';
import { UserXps } from '../core/models/user-xp.model';
import { XpHistory } from '../core/models/xp-history.model';
import { Responer } from '../core/utils/responer';

export class XPServices {
	public async usersAndTotalXP() {
		const result = await UserXps.aggregate([
			{
				$lookup: {
					from: 'xphistories',
					localField: 'user',
					foreignField: 'user',
					as: 'xpHistory',
				},
			},
			{
				$addFields: {
					totalEarnedXp: { $sum: '$xpHistory.xpAwarded' },
				},
			},
			{
				$project: {
					_id: 0,
					user: 1,
					totalXp: 1,
					totalEarnedXp: 1,
					level: 1,
					nextLevelXp: 1,
				},
			},
		]);
		return Responer({
			statusCode: 200,
			body: {
				result,
			},
		});
	}

	public async usersAtSpecificLevel(level: number) {
		const result = await UserXps.find({ level: { $gt: level } })
			.populate('user', 'firstName lastName')
			.exec();
		return Responer({
			statusCode: 200,
			body: {
				result,
			},
		});
	}

	public async topNUsers(limit: number) {
		const result = await UserXps.aggregate([
			{
				$sort: { totalXps: -1 },
			},
			{
				$limit: limit,
			},
			{
				$lookup: {
					from: 'bits',
					localField: 'user',
					foreignField: '_id',
					as: 'userInfo',
				},
			},
			{
				$project: {
					_id: 0,
					user: { $arrayElemAt: ['$userInfo', 0] },
					totalXp: 1,
					level: 1,
				},
			},
		]);

		return Responer({
			statusCode: 200,
			body: {
				result,
				length: result.length,
			},
		});
	}

	public async xpActions() {
		const xpActions = await XpHistory.find({ action: { $regex: /^like_/ } })
			.populate('user', 'firstName lastName')
			.exec();
		return Responer({
			statusCode: 200,
			body: {
				result: xpActions,
			},
		});
	}

	public async averageXpPerUser() {
		const result = await XpHistory.aggregate([
			{
				$group: {
					_id: '$user',
					avgXp: { $avg: '$xpAwarded' },
				},
			},
			{
				$lookup: {
					from: 'bits',
					localField: '_id',
					foreignField: '_id',
					as: 'userInfo',
				},
			},
			{
				$project: {
					_id: 0,
					userDetails: { $arrayElemAt: ['$userInfo', 0] },
					avgXp: 1,
				},
			},
		]);
		return Responer({
			statusCode: 200,
			body: {
				result,
			},
		});
	}

	public async averageXpEarnedByActionType() {
		const result = await XpHistory.aggregate([
			{
				$group: {
					_id: '$action',
					totalXp: { $sum: '$xpAwarded' },
					actionCount: { $count: {} },
				},
			},
			{
				$sort: { totalXp: -1 },
			},
		]);
		return Responer({
			statusCode: 200,
			body: {
				result,
			},
		});
	}

	public async userWithSpecificXPLevel() {
		const result = await UserXps.find({
			level: { $in: [2, 4, 5] },
		});
		return Responer({
			statusCode: 200,
			body: {
				result,
			},
		});
	}

	public async xpAndCurrencyData() {
		const result = await UserXps.aggregate([
			{
				$match: {
					user: new mongoose.Types.ObjectId('67471d663a272515052e1db7'),
				},
			},
			{
				$lookup: {
					from: 'currencyhistories',
					localField: 'user',
					foreignField: 'user',
					as: 'currencyHistory',
				},
			},
			{
				$project: {
					user: 1,
					totalXp: 1,
					level: 1,
					currencyHistory: 1,
				},
			},
		]);
		return Responer({
			statusCode: 200,
			body: {
				result,
			},
		});
	}

	public async xpHistoryGroupedByDate() {
		const result = await UserXps.aggregate([
			{
				$group: {
					_id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
					totalXp: { $sum: '$xpAwarded' },
					action: { $push: '$action' },
				},
			},
			{
				$sort: { _id: -1 },
			},
		]);
		return Responer({
			statusCode: 200,
			body: {
				result,
			},
		});
	}

	public async xpAndLevelwithConditionalFeids() {
		const result = await UserXps.aggregate([
			{
				$lookup: {
					from: 'xplevelsettings',
					localField: 'level',
					foreignField: 'level',
					as: 'levelDetails',
				},
			},
			{
				$addFields: {
					currentLevelDetails: { $arrayElemAt: ['$levelDetails', 0] },
				},
			},
			{
				$project: {
					_id: 0,
					user: 1,
					totalXp: 1,
					level: 1,
					nextLevelXp: 1,
					'currentLevelDetails.requiredXp': 1,
				},
			},
		]);
		return Responer({
			statusCode: 200,
			body: {
				result,
			},
		});
	}
}
