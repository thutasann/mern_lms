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
}
