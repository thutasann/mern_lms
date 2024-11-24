import { bitModel, lessonModel } from '../../models/test.model';
import { logger } from '../logger';
import {
	getRandomAge,
	getRandomDate,
	getRandomName,
	getRandomTitle,
} from './seed-utils';

/**
 * Seed Data for testing purpose
 */
export async function seedData() {
	try {
		await bitModel.deleteMany({});
		await lessonModel.deleteMany({});

		const bits: any[] = [];
		for (let i = 0; i < 100; i++) {
			bits.push({
				firstName: getRandomName(),
				lastName: getRandomName(),
				age: getRandomAge(),
				birthday: getRandomDate(new Date(1940, 0, 1), new Date(2005, 0, 1)),
			});
		}

		const bitDocs = await bitModel.insertMany(bits);
		logger.info(`Inserted ${bitDocs.length} BIT documents.`);

		const lessons: any[] = [];
		for (let i = 0; i < 200; i++) {
			const randomAuthor = bitDocs[Math.floor(Math.random() * bitDocs.length)];
			lessons.push({
				title: getRandomTitle(),
				author: randomAuthor._id,
			});
		}
		const lessonDocs = await lessonModel.insertMany(lessons);
		logger.info(`Inserted ${lessonDocs.length} Lesson documents.`);
		logger.info(`Data seeded successfully! ✅`);
	} catch (error) {
		logger.error(`Error seeding data: ${error}`);
	}
}
