import { Request, Response } from 'express';
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

	/** lookup one `$lookup` */
	@catchAsyncErrors()
	public async lookupOne(req: Request, res: Response | any) {
		try {
			const assignments = await assignmentModel.aggregate([
				{
					$lookup: {
						from: 'lessons',
						localField: 'lesson',
						foreignField: '_id',
						as: 'lessonDetails',
					},
				},
			]);
			return res.status(200).json(assignments);
		} catch (error: any) {
			return res.status(500).json(error);
		}
	}

	/** `$unwind` after $lookup to flatten the resulting array into individual documents. two `$lookup` */
	@catchAsyncErrors()
	public async lookupTwo(req: Request, res: Response | any) {
		try {
			const assignments = await assignmentModel.aggregate([
				{
					$lookup: {
						from: 'lessons',
						localField: 'lesson',
						foreignField: '_id',
						as: 'lessonDetails',
					},
				},
				{
					$unwind: {
						path: '$lessonDetails',
						preserveNullAndEmptyArrays: true,
					},
				},
			]);
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

	/** Populate Assignment's Lesson and Grade Information `$populate`  */
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

	/**
	 * `$lookup` with Filtering and Projection in the Aggregation Pipeline
	 * - to include specific fields or perform filtering during the $lookup stage to limit the data being joined.
	 * - filtering the lessonDetails by title and projecting only the fields you need.
	 */
	@catchAsyncErrors()
	public async getAssignmentsWithFilteredLesson(
		req: Request,
		res: Response | any,
	) {
		try {
			const assignments = await assignmentModel.aggregate([
				{
					$lookup: {
						from: 'lessons',
						foreignField: '_id',
						localField: 'lesson',
						as: 'lessonDetails',
						pipeline: [
							{
								// filter lessons containing 'React'
								$match: {
									title: { $regex: 'React', $options: 'i' },
								},
							},
							{
								// project only title and author
								$project: {
									title: 1,
									author: 1,
								},
							},
						],
					},
				},
				{
					$unwind: {
						path: '$lessonDetails',
						preserveNullAndEmptyArrays: true,
					},
				},
			]);
			return res.status(200).json(assignments);
		} catch (error: any) {
			return res.status(500).json(error);
		}
	}

	/**
	 * `$lookup` with `$arrayElemAt` to Fetch First Matched Element
	 * - fetch only the first matched document from the joined collection
	 */
	@catchAsyncErrors()
	public async getAssignmentsWithFirstGrade(req: Request, res: Response | any) {
		try {
			const assignments = await assignmentModel.aggregate([
				{
					$lookup: {
						from: 'grades',
						localField: '_id',
						foreignField: 'assignment',
						as: 'gradesDetails',
					},
				},
				{
					$addFields: {
						firstGrade: {
							$arrayElemAt: ['$gradesDetails', 0],
						},
					},
				},
				{
					$project: {
						_id: 1,
						title: 1,
						firstGrade: 1,
					},
				},
			]);
			return res.status(200).json(assignments);
		} catch (error: any) {
			return res.status(500).json(error);
		}
	}

	/**
	 * `$lookup` with `$group` to aggregate grades by lesson
	 * -  use $match to filter data in the lookup stage and $group to aggregate the results after performing the lookup.
	 */
	@catchAsyncErrors()
	public async getGradesGroupedByLesson(req: Request, res: Response | any) {
		try {
			const result = await assignmentModel.aggregate([
				{
					$lookup: {
						from: 'grades',
						localField: '_id',
						foreignField: 'assignment',
						as: 'gradesDetails',
					},
				},
				{
					$unwind: '$gradesDetails',
				},
				{
					$group: {
						_id: '$lesson',
						totalGrades: { $sum: '$gradesDetails.grade' },
						averageGrade: { $avg: '$gradesDetails.grade' },
						gradeCount: { $count: {} },
					},
				},
			]);
			return res.status(200).json(result);
		} catch (error: any) {
			return res.status(500).json(error);
		}
	}

	/**
	 * `$lookup` with multiple `$unwind` for nested joins
	 * - to join multiple levels of nested arrays, you can use multiple $unwind stages in your pipeline.
	 * -  join Assignments with Lessons, and then Lessons with Authors (assuming authors are stored in a separate collection).
	 */
	@catchAsyncErrors()
	public async getAssignmentsWithLessonAndAuthor(
		req: Request,
		res: Response | any,
	) {
		try {
			const result = await assignmentModel.aggregate([
				{
					$lookup: {
						from: 'lessons',
						localField: 'lesson',
						foreignField: '_id',
						as: 'lessonDetails',
					},
				},
				{
					$unwind: '$lessonDetails',
				},
				{
					$lookup: {
						from: 'bits',
						localField: 'lessonDetails.author',
						foreignField: '_id',
						as: 'authorDetails',
					},
				},
				{
					$unwind: '$authorDetails',
				},
				{
					$project: {
						'authorDetails.__v': 0,
						'lessonDetails.__v': 0,
					},
				},
			]);
			return res.status(200).json(result);
		} catch (error: any) {
			return res.status(500).json(error);
		}
	}

	/**
	 * `$match` to get the active assignments after today
	 */
	@catchAsyncErrors()
	public async getActiveAssignmentsAfterToday(
		req: Request,
		res: Response | any,
	) {
		try {
			const today = new Date();
			const result = await assignmentModel.aggregate([
				{
					$match: {
						status: 'in-active',
						dueDate: { $gt: today },
					},
				},
			]);
			return res.status(200).json(result);
		} catch (error: any) {
			return res.status(500).json(error);
		}
	}

	/**
	 * `$group` to aggregate data by lesson
	 * - groups assignments by lesson and calculates the average grade for each lesson from the grades array.
	 */
	public async getAverageGradeByLesson(req: Request, res: Response | any) {
		try {
			const result = await assignmentModel.aggregate([
				{
					$lookup: {
						from: 'grades',
						localField: '_id',
						foreignField: 'assignment',
						as: 'gradesDetails',
					},
				},

				{
					$unwind: '$gradesDetails',
				},
				{
					$group: {
						_id: '$lesson',
						totalGrades: { $sum: '$gradesDetails.grade' },
						averageGrade: { $avg: '$gradesDetails.grade' },
						student: { $first: '$gradesDetails.student' },
						gradeCount: { $count: {} },
					},
				},
			]);
			return res.status(200).json(result);
		} catch (error: any) {
			return res.status(500).json(error);
		}
	}

	/**
	 * `$arrayElemAt` to get the first Grade of an Assignment
	 */
	public async getFirstGradeForAssignments(req: Request, res: Response | any) {
		try {
			const result = await assignmentModel.aggregate([
				{
					$lookup: {
						from: 'grades',
						localField: '_id',
						foreignField: 'assignment',
						as: 'gradesDetails',
					},
				},
				{
					$addFields: {
						firstGrade: { $arrayElemAt: ['$gradesDetails.grade', 0] },
					},
				},
				{
					$project: {
						title: 1,
						firstGrade: 1,
					},
				},
			]);
			return res.status(200).json(result);
		} catch (error: any) {
			return res.status(500).json(error);
		}
	}

	/**
	 * `$match`, `$group`, and `$arrayElemAt` for Complex Aggregations
	 * - filtering records with $match, grouping by a field with $group, and using $arrayElemAt to get specific elements from an array.
	 */
	public async getCompletedAssignmentsWithFirstGradeByLesson(
		req: Request,
		res: Response | any,
	) {
		try {
			const result = await assignmentModel.aggregate([
				{
					$match: {
						status: 'active',
					},
				},
				{
					$lookup: {
						from: 'grades',
						localField: '_id',
						foreignField: 'assignment',
						as: 'gradesDetails',
					},
				},
				{
					$unwind: '$gradesDetails',
				},
				{
					$group: {
						_id: '$lesson',
						totalGrades: {
							$sum: '$gradesDetails.grade',
						},
						firstGrade: {
							$first: '$gradesDetails.grade',
						},
					},
				},
				{
					$project: {
						lessonId: '$_id',
						totalGrades: 1,
						firstGrade: 1,
					},
				},
			]);
			return res.status(200).json(result);
		} catch (error: any) {
			return res.status(500).json(error);
		}
	}
}

export const operatorsController = new OperatorsController();
