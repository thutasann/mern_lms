import { CronJob } from 'cron';
import { bitModel } from '../core/models/test.model';
import { logger } from '../core/utils/logger';
import {
	getRandomAge,
	getRandomDate,
	getRandomName,
} from '../core/utils/random-generate';

async function saveRandomUsers() {
	logger.info(`Running user CronJob: Adding random BIT Users`);

	try {
		const randomUser = {
			firstName: getRandomName(),
			lastName: getRandomName(),
			age: getRandomAge(),
			birthday: getRandomDate(new Date(1940, 0, 1), new Date(2005, 0, 1)),
		};

		const newUser = await bitModel.create(randomUser);
		logger.info(
			`Added BIT user: ${newUser.firstName} ${newUser.lastName}, Age: ${newUser.age}`,
		);
	} catch (error) {
		logger.error('Error adding BIT user:', error);
	}
}

/** Cron job to insert random users every minute */
export const userJob = new CronJob(
	'* * * * *',
	async function () {
		await saveRandomUsers();
	},
	null,
);
