import { UserXps } from '../core/models/user-xp.model';
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
}
