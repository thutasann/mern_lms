import {
	assignmentModel,
	bitModel,
	gradeModel,
	lessonModel,
} from '../../models/test.model';
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
		logger.info(`==> Inserted ${bitDocs.length} BIT documents.`);

		const lessons: any[] = [];
		for (let i = 0; i < 200; i++) {
			const randomAuthor = bitDocs[Math.floor(Math.random() * bitDocs.length)];
			lessons.push({
				title: getRandomTitle(),
				author: randomAuthor._id,
			});
		}
		const lessonDocs = await lessonModel.insertMany(lessons);
		logger.info(`==> Inserted ${lessonDocs.length} Lesson documents.`);
		logger.info(`Data seeded successfully! ✅`);
	} catch (error) {
		logger.error(`Error seeding data: ${error}`);
	}
}

/**
 * Seed Assignment and Grade Data
 */
export const seedAssignmentAndGradeData = async () => {
	try {
		await assignmentModel.deleteMany({});
		await gradeModel.deleteMany({});

		const lessons = await lessonModel.find({});
		const assignments = await assignmentModel.insertMany([
			{
				title: 'JavaScript Basics Assignment',
				description: 'Complete the tasks related to JavaScript fundamentals.',
				dueDate: new Date('2024-12-01'),
				lesson: lessons[0]._id, // Assign to the first lesson
			},
			{
				title: 'React Basics Assignment',
				description: 'Complete the tasks related to basic React concepts.',
				dueDate: new Date('2024-12-15'),
				lesson: lessons[1]._id, // Assign to the second lesson
			},
		]);
		logger.info('==> Assignments seeded: ' + assignments?.length);

		const students = await bitModel.find({});
		const grades = await gradeModel.insertMany([
			{
				student: students[0]._id, // The first student
				assignment: assignments[0]._id, // The first assignment
				grade: 85,
				feedback: 'Great job! Keep practicing.',
			},
			{
				student: students[1]._id, // The second student
				assignment: assignments[1]._id, // The second assignment
				grade: 90,
				feedback: "Well done! You've understood the basics.",
			},
		]);
		logger.info('==> Grades seeded: ' + grades?.length);
		logger.info(`Assignments and Grade Data seeded successfully! ✅`);
	} catch (error) {
		console.error('Error seeding assignment and grade data:', error);
	}
};
