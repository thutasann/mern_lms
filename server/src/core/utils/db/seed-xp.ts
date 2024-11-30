import { CurrencyHistory } from '../../models/currency.model';
import { bitModel } from '../../models/test.model';
import { UserXps } from '../../models/user-xp.model';
import { XpHistory } from '../../models/xp-history.model';
import { XpLevelSetting } from '../../models/xp-level-settings.model';
import { logger } from '../logger';

/** Seed XP Data */
export async function seedXpData() {
	try {
		const existingXpLevels = await XpLevelSetting.countDocuments();
		const existingUsers = await UserXps.countDocuments();

		if (existingXpLevels > 0 && existingUsers > 0) {
			logger.info('XP-related data already seeded. Skipping.  ✅');
			return;
		}

		await XpHistory.deleteMany({});
		await CurrencyHistory.deleteMany({});
		await UserXps.deleteMany({});
		await XpLevelSetting.deleteMany({});

		logger.info('==> Cleared XP-related collections.');

		/** Seed XP Levels */
		const xpLevels = [
			{ level: 1, requiredXp: 0 },
			{ level: 2, requiredXp: 100 },
			{ level: 3, requiredXp: 300 },
			{ level: 4, requiredXp: 600 },
			{ level: 5, requiredXp: 1000 },
		];

		const xpLevelDocs = await XpLevelSetting.insertMany(xpLevels);
		logger.info(`==> Inserted ${xpLevelDocs.length} XP Level settings.`);

		/** Seed Users (BITs) */
		const bitUsers = await bitModel.find().limit(10);
		if (bitUsers.length === 0) {
			throw new Error(
				'No BIT users found. Ensure BITs are seeded before running this script.',
			);
		}

		const userXpData = bitUsers.map((user) => ({
			user: user._id,
			totalXp: Math.floor(Math.random() * 500),
			level: 1,
			nextLevelXp: 100,
			lastUpdated: new Date(),
		}));

		const userXpDocs = await UserXps.insertMany(userXpData);
		logger.info(`==> Inserted ${userXpDocs.length} User XP documents.`);

		/** Seed XP History */
		const xpHistoryData = bitUsers.map((user) => ({
			user: user._id,
			action: 'like_post',
			xpAwarded: Math.floor(Math.random() * 10) + 1,
			date: new Date(),
		}));

		const xpHistoryDocs = await XpHistory.insertMany(xpHistoryData);
		logger.info(`==> Inserted ${xpHistoryDocs.length} XP History documents.`);

		/** Seed Currency History */
		const currencyHistoryData = bitUsers.map((user) => ({
			user: user._id,
			amount: Math.floor(Math.random() * 100),
			reason: 'reward',
			date: new Date(),
		}));

		const currencyHistoryDocs = await CurrencyHistory.insertMany(
			currencyHistoryData,
		);
		logger.info(
			`==> Inserted ${currencyHistoryDocs.length} Currency History documents.`,
		);
	} catch (error) {
		console.error('Error seeding XP-related data:', error);
	}
}
