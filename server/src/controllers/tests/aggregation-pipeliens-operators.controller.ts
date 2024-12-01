import { catchAsyncErrors } from '../../core/decorators/catcy-async-errrors.decorator';
import {
	assignmentModel,
	gradeModel,
	lessonModel,
} from '../../core/models/test.model';
import { XpHistory } from '../../core/models/xp-history.model';

class AggregationPipelineController {
	/** `$group` stage in MongoDB aggregation pipelines is used to group documents by a specified key and apply aggregate functions  */
	@catchAsyncErrors()
	public async $groupUsages(req: Request, res: Response | any) {
		try {
			const author_total_lessons = await lessonModel.aggregate([
				{
					$group: {
						_id: '$author',
						totalLessons: { $sum: 1 },
					},
				},
				{
					$lookup: {
						from: 'bits',
						localField: '_id',
						foreignField: '_id',
						as: 'authorDetails',
					},
				},
				{
					$unwind: {
						path: '$authorDetails',
						preserveNullAndEmptyArrays: true,
					},
				},
				{
					$project: {
						_id: 0,
						author: {
							firstName: '$authorDetails.firstName',
							lastName: '$authorDetails.lastName',
						},
						totalLessons: 1,
					},
				},
			]);

			const count_assignments_by_status = await assignmentModel.aggregate([
				{
					$group: {
						_id: { lessonId: '$lesson', status: '$status' },
						assignmentCount: { $sum: 1 },
					},
				},
			]);

			const average_xp_by_each_user = await XpHistory.aggregate([
				{
					$group: {
						_id: {
							user: '$user',
							date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
						},
						averageXp: { $avg: '$xpAwarded' },
					},
				},
			]);

			const leaderborad_by_summing_xps = await XpHistory.aggregate([
				{
					$group: {
						_id: '$user',
						totalXp: { $sum: '$xpAwarded' },
					},
				},
				{
					$sort: { totalXp: -1 },
				},
			]);

			const grades_feedbacks = await gradeModel.aggregate([
				{
					$group: {
						_id: '$student',
						feedbacks: { $push: '$feedback' },
					},
				},
			]);

			const disinct_lesson_titles = await lessonModel.aggregate([
				{
					$group: {
						_id: '$author',
						distinctTitles: { $addToSet: '$title' },
					},
				},
				{
					$project: {
						_id: 1,
						uniqueTitle: { $size: '$distinctTitles' },
					},
				},
			]);

			const group_assignments_by_year = await assignmentModel.aggregate([
				{
					$group: {
						_id: { year: { $year: '$createdAt' } },
						totalAssignments: { $sum: 1 },
					},
				},
			]);

			const xp_and_list_of_actions = await XpHistory.aggregate([
				{
					$group: {
						_id: '$user',
						actions: { $push: '$action' },
						totalXP: { $sum: '$xpAwarded' },
					},
				},
				{
					$lookup: {
						from: 'bits',
						localField: '_id',
						foreignField: '_id',
						as: 'userDetails',
					},
				},
				{
					$project: {
						_id: 0,
						user: { $arrayElemAt: ['$userDetails', 0] },
						totalXP: 1,
						actions: 1,
					},
				},
			]);

			const total_number_of_grades_per_student = await lessonModel.aggregate([
				{
					$lookup: {
						from: 'assignments',
						localField: '_id',
						foreignField: 'lesson',
						as: 'grades',
					},
				},
				{
					$unwind: '$grades',
				},
				{
					$lookup: {
						from: 'grades',
						localField: 'grades._id',
						foreignField: 'assignment',
						as: 'assignmentDetails',
					},
				},
				{
					$unwind: '$assignmentDetails',
				},
				{
					$lookup: {
						from: 'bits',
						localField: 'assignmentDetails.student',
						foreignField: '_id',
						as: 'studentDetails',
					},
				},
				{
					$unwind: '$studentDetails',
				},
				{
					$group: {
						_id: '$studentDetails.firstName',
						totalGrades: { $sum: 1 },
					},
				},
			]);

			const result = {
				total_number_of_grades_per_student,
				xp_and_list_of_actions,
				group_assignments_by_year,
				disinct_lesson_titles,
				grades_feedbacks,
				leaderborad_by_summing_xps,
				average_xp_by_each_user,
				author_total_lessons,
				count_assignments_by_status,
			};
			return res.status(200).json(result);
		} catch (error: any) {
			return res.status(500).json(error);
		}
	}
}

export const aggregationOpeartorController =
	new AggregationPipelineController();
