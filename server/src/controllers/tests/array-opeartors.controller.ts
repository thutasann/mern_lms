import { catchAsyncErrors } from '../../core/decorators/catcy-async-errrors.decorator';
import courseModel from '../../core/models/course.model';
import { assignmentModel, bitModel } from '../../core/models/test.model';
import { XpHistory } from '../../core/models/xp-history.model';

/**
 * Array Operators
 */
class ArrayOperators {
	/** `$arrayElemAt` */
	@catchAsyncErrors()
	public async $arrayElemAt(req: Request, res: Response | any) {
		try {
			const first_benefit = await courseModel.aggregate([
				{
					$project: {
						_id: 0,
						name: 1,
						firstBenefit: { $arrayElemAt: ['$benefits', 0] },
					},
				},
			]);

			const last_benefit = await courseModel.aggregate([
				{
					$project: {
						_id: 0,
						name: 1,
						lastBenefit: { $arrayElemAt: ['$benefits', -1] },
					},
				},
			]);

			const with_lookup = await assignmentModel.aggregate([
				{
					$lookup: {
						from: 'lessons',
						localField: 'lesson',
						foreignField: '_id',
						as: 'lessonDetails',
					},
				},
				{
					$project: {
						_id: 0,
						title: 1,
						status: 1,
						description: 1,
						firstLesson: { $arrayElemAt: ['$lessonDetails', 0] },
					},
				},
			]);

			const conditional_logic = await XpHistory.aggregate([
				{
					$group: {
						_id: '$user',
						actions: { $push: '$action' },
					},
				},
				{
					$addFields: {
						firstAction: { $arrayElemAt: ['$actions', 0] },
					},
				},
			]);

			const extracted_nested_fields = await bitModel.aggregate([
				{
					$lookup: {
						from: 'grades',
						localField: '_id',
						foreignField: 'student',
						as: 'gradesData',
					},
				},
				{
					$project: {
						_id: 0,
						firstName: 1,
						recentGrade: { $arrayElemAt: ['$gradesData', -1] },
					},
				},
			]);

			const result = {
				first_benefit,
				last_benefit,
				with_lookup,
				conditional_logic,
				extracted_nested_fields,
			};
			return res.status(200).json(result);
		} catch (error: any) {
			return res.status(500).json(error);
		}
	}
}

export const arrayOperatorsController = new ArrayOperators();
