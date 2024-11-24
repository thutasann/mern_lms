import { Request } from 'express';
import { catchAsyncErrors } from '../../core/decorators/catcy-async-errrors.decorator';
import {
	assignmentModel,
	gradeModel,
	lessonModel,
} from '../../core/models/test.model';

/**
 * Mongoose Operators
 * @description explore some of the most common operators such as $gt, $lt, $in, $exists, $regex, $lookup, and $populate
 */
class OperatorsController {
	/** get upcoming assignments `$gt` */
	@catchAsyncErrors()
	public async upcomingAssignments(req: Request, res: Response | any) {
		try {
			const today = new Date();
			const assignments = await assignmentModel.find({
				dueDate: { $gt: today },
			});
			return res.status(200).json(assignments);
		} catch (error: any) {
			return res.status(500).json(error);
		}
	}

	/** studends who have a grade higher than 80 `$gt` */
	@catchAsyncErrors()
	public async studentesWithHighGrades(req: Request, res: Response | any) {
		try {
			const result = await gradeModel
				.find({
					grade: { $gt: 60 },
				})
				.populate('student')
				.lean();
			return res.status(200).json(result);
		} catch (error: any) {
			return res.status(500).json(error);
		}
	}

	/** find assignments for specific lessons `$in` */
	@catchAsyncErrors()
	public async findAssignmentsForSpecificLessons(
		req: Request,
		res: Response | any,
	) {
		try {
			const lessons = await lessonModel.find({
				title: {
					$in: ['Understanding MongoDB Aggregation', 'Introduction to Node.js'],
				},
			});

			const assignments = await assignmentModel.find({
				lesson: {
					$in: lessons.find((lesson) => lesson._id),
				},
			});

			return res.status(200).json(assignments);
		} catch (error: any) {
			return res.status(500).json(error);
		}
	}

	/** find students who have submitted their grades `$exists` */
	@catchAsyncErrors()
	public async getGradesWithFeedback(req: Request, res: Response | any) {
		try {
			const gradesWithFeedback = await gradeModel
				.find({
					feedback: {
						$exists: true,
						$ne: null,
					},
				})
				.populate('student')
				.populate('assignment');
			return res.status(200).json(gradesWithFeedback);
		} catch (error: any) {
			return res.status(500).json(error);
		}
	}

	/** Find Assignments with a Title Matching a Pattern `$regex` */
	@catchAsyncErrors()
	public async getAssignmentsWithPattern(req: Request, res: Response | any) {
		try {
			const assignments = await assignmentModel.find({
				title: {
					$regex: /React/,
					$options: 'i',
				},
			});
			return res.status(200).json(assignments);
		} catch (error: any) {
			return res.status(500).json(error);
		}
	}

	/** Fetch Assignments with Lesson and Grade Information `$lookup`  */
	@catchAsyncErrors()
	public async getAssignmentsWithGradeInfo(req: Request, res: Response | any) {
		try {
			const assignments = await assignmentModel.aggregate([
				{
					$lookup: {
						from: 'lessons',
						localField: 'lesson',
						foreignField: '_id',
						as: 'lessonInfo',
					},
				},
				{
					$lookup: {
						from: 'grades',
						localField: '_id',
						foreignField: 'assignment',
						as: 'gradesInfo',
					},
				},
				{
					// flattern lessonInfo
					$unwind: {
						path: '$lessonInfo',
						preserveNullAndEmptyArrays: true,
					},
				},
				{
					// flattern gradesInfo
					$unwind: {
						path: '$gradesInfo',
						preserveNullAndEmptyArrays: true,
					},
				},
				{
					$project: {
						lesson: 0,
						__v: 0,
					},
				},
			]);
			return res.status(200).json(assignments);
		} catch (error: any) {
			return res.status(500).json(error);
		}
	}

	/**  Populate Assignment's Lesson and Grade Information `$populate`  */
	@catchAsyncErrors()
	public async getAssignmentsWithPopulatedLesson(
		req: Request,
		res: Response | any,
	) {
		try {
			const assignments = await assignmentModel
				.find()
				.populate('lesson')
				.exec();
			return res.status(200).json(assignments);
		} catch (error: any) {
			return res.status(500).json(error);
		}
	}

	/** Get Assignments by Date and Lesson `$and` */
	@catchAsyncErrors()
	public async getAssignmentsByDateAndLesson(
		req: Request,
		res: Response | any,
	) {
		try {
			const assignments = await assignmentModel.find({
				$and: [
					{
						dueDate: { $gt: new Date() },
					},
					{
						lesson: {
							$in: ['6742efb958f2d793d501ca1c'],
						},
					},
				],
			});
			return res.status(200).json(assignments);
		} catch (error: any) {
			return res.status(500).json(error);
		}
	}
}

export const operatorsController = new OperatorsController();
